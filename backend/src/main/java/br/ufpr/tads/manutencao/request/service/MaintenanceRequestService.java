package br.ufpr.tads.manutencao.request.service;

import br.ufpr.tads.manutencao.request.MaintenanceRequestMapper;
import br.ufpr.tads.manutencao.request.dto.MaintenanceRequestResponse;
import br.ufpr.tads.manutencao.request.exception.InvalidRequestStatusException;
import br.ufpr.tads.manutencao.request.exception.RequestNotFoundException;
import br.ufpr.tads.manutencao.request.model.MaintenanceRequest;
import br.ufpr.tads.manutencao.request.model.RequestStatus;
import br.ufpr.tads.manutencao.request.repository.MaintenanceRequestRepository;
import br.ufpr.tads.manutencao.user.model.Employee;
import br.ufpr.tads.manutencao.user.repository.EmployeeRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MaintenanceRequestService {
  private final MaintenanceRequestRepository requestRepository;
  private final RequestHistoryService historyService;
  private final EmployeeRepository employeeRepository;

  public MaintenanceRequestService(MaintenanceRequestRepository requestRepository, RequestHistoryService historyService,
                                   EmployeeRepository employeeRepository) {
    this.requestRepository = requestRepository;
    this.historyService = historyService;
    this.employeeRepository = employeeRepository;
  }

  private MaintenanceRequest findAndValidateOwnership(Long requestId, Long customerId) {
    return requestRepository.findByIdAndCustomerId(requestId, customerId)
            .orElseThrow(() -> new RequestNotFoundException("Solicitação não encontrada ou acesso negado."));
  }

  @Transactional
  public MaintenanceRequestResponse findById(Long id, Long customerId) {
    MaintenanceRequest req = findAndValidateOwnership(id, customerId);
    return MaintenanceRequestMapper.toResponse(req);
  }

  @Transactional
  public List<MaintenanceRequestResponse> listByCustomer(Long customerId) {
    return requestRepository.findByCustomerIdOrderByOpeningDateTimeAsc(customerId)
            .stream().map(MaintenanceRequestMapper::toResponse).toList();
  }

  @Transactional
  public MaintenanceRequestResponse approveRequest(Long id, Long customerId) {
    MaintenanceRequest req = findAndValidateOwnership(id, customerId);

    if (req.getStatus() != RequestStatus.ORCADA) {
      throw new InvalidRequestStatusException("Apenas serviços no estado ORÇADA podem ser aprovados.");
    }

    req.setStatus(RequestStatus.APROVADA);

    historyService.register(req, RequestStatus.ORCADA, RequestStatus.APROVADA, req.getCustomer(), "Orçamento aprovado pelo cliente.");
    requestRepository.save(req);
    return MaintenanceRequestMapper.toResponse(req);
  }

  @Transactional
  public MaintenanceRequestResponse rejectRequest(Long id, Long customerId, String reason) {
    MaintenanceRequest req = findAndValidateOwnership(id, customerId);

    if (req.getStatus() != RequestStatus.ORCADA) {
      throw new InvalidRequestStatusException("Apenas serviços no estado ORÇADA podem ser rejeitados.");
    }

    req.setStatus(RequestStatus.REJEITADA);
    req.setRejectionReason(reason);

    historyService.register(req, RequestStatus.ORCADA, RequestStatus.REJEITADA, req.getCustomer(), "Serviço Rejeitado. Motivo: " + reason);
    requestRepository.save(req);
    return MaintenanceRequestMapper.toResponse(req);
  }

  @Transactional
  public MaintenanceRequestResponse rescueRequest(Long id, Long customerId) {
    MaintenanceRequest req = findAndValidateOwnership(id, customerId);
    if (req.getStatus() != RequestStatus.REJEITADA) {
      throw new InvalidRequestStatusException("Apenas serviços rejeitados podem ser resgatados.");
    }
    req.setStatus(RequestStatus.APROVADA);
    req.setRejectionReason(null);
    historyService.register(req, RequestStatus.REJEITADA, RequestStatus.APROVADA, req.getCustomer(), "Serviço resgatado e aprovado pelo cliente.");
    requestRepository.save(req);
    return MaintenanceRequestMapper.toResponse(req);
  }

  @Transactional
  public MaintenanceRequestResponse payRequest(Long id, Long customerId) {
    MaintenanceRequest req = findAndValidateOwnership(id, customerId);
    if (req.getStatus() != RequestStatus.ARRUMADA) {
      throw new InvalidRequestStatusException("Impossível pagar: o equipamento não está no estado ARRUMADA.");
    }
    req.setStatus(RequestStatus.PAGA);
    req.setPaymentDateTime(LocalDateTime.now());
    historyService.register(req, RequestStatus.ARRUMADA, RequestStatus.PAGA, req.getCustomer(), "Pagamento efetuado pelo cliente.");
    requestRepository.save(req);
    return MaintenanceRequestMapper.toResponse(req);

  }

  @Transactional
  public List<MaintenanceRequestResponse> listOpen() {
    return requestRepository.findByStatusOrderByOpeningDateTimeAsc(RequestStatus.ABERTA)
            .stream().map(MaintenanceRequestMapper::toResponse).toList();
  }

  private MaintenanceRequest findForEmployee(Long id) {
    return requestRepository.findById(id)
            .orElseThrow(() -> new RequestNotFoundException("Solicitação não encontrada."));
  }

  @Transactional
  public MaintenanceRequestResponse findByIdForEmployee(Long id) {
    return MaintenanceRequestMapper.toResponse(findForEmployee(id));
  }

  @Transactional
  public MaintenanceRequestResponse quoteRequest(Long id, Long employeeId, BigDecimal quoteValue) {
    MaintenanceRequest req = findForEmployee(id);
    if (req.getStatus() != RequestStatus.ABERTA) {
      throw new InvalidRequestStatusException("Apenas serviços no estado ABERTA podem ser orçados.");
    }
    Employee employee = employeeRepository.findById(employeeId)
            .filter(Employee::isActive)
            .orElseThrow(() -> new EntityNotFoundException("Funcionário não encontrado"));

    req.setStatus(RequestStatus.ORCADA);
    req.setQuoteValue(quoteValue);
    req.setEmployee(employee);
    historyService.register(req, RequestStatus.ABERTA, RequestStatus.ORCADA, employee, "Orçamento realizado pelo funcionário.");
    requestRepository.save(req);
    return MaintenanceRequestMapper.toResponse(req);
  }

  @Transactional
  public List<MaintenanceRequestResponse> listAllForEmployee(
          Long employeeId,
          String filterType,
          LocalDate startDate,
          LocalDate endDate
  ) {
    LocalDateTime startDateTime = LocalDateTime.of(1970, 1, 1, 0, 0);
    LocalDateTime endDateTime = LocalDateTime.of(2100, 12, 31, 23, 59, 59);

    if ("TODAY".equalsIgnoreCase(filterType)) {
      LocalDate today = LocalDate.now();
      startDateTime = today.atStartOfDay();
      endDateTime = today.atTime(23, 59, 59);
    } else if ("PERIOD".equalsIgnoreCase(filterType)) {
      if (startDate != null) {
        startDateTime = startDate.atStartOfDay();
      }
      if (endDate != null) {
        endDateTime = endDate.atTime(23, 59, 59);
      }
    }

    return requestRepository.findForEmployeeWithFilter(employeeId, startDateTime, endDateTime)
            .stream()
            .map(MaintenanceRequestMapper::toResponse)
            .toList();
  }
}