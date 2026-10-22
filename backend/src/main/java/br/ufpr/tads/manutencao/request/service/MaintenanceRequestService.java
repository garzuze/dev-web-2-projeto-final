package br.ufpr.tads.manutencao.request.service;

import br.ufpr.tads.manutencao.request.dto.MaintenanceRequestResponse;
import br.ufpr.tads.manutencao.request.exception.InvalidRequestStatusException;
import br.ufpr.tads.manutencao.request.exception.RequestNotFoundException;
import br.ufpr.tads.manutencao.request.model.MaintenanceRequest;
import br.ufpr.tads.manutencao.request.model.RequestStatus;
import br.ufpr.tads.manutencao.request.repository.MaintenanceRequestRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MaintenanceRequestService {
  private final MaintenanceRequestRepository requestRepository;
  private final RequestHistoryService historyService;

  public MaintenanceRequestService(MaintenanceRequestRepository requestRepository, RequestHistoryService historyService) {
    this.requestRepository = requestRepository;
    this.historyService = historyService;
  }

  private MaintenanceRequest findAndValidateOwnership(Long requestId, Long customerId) {
    return requestRepository.findByIdAndCustomerId(requestId, customerId)
            .orElseThrow(() -> new RequestNotFoundException("Solicitação não encontrada ou acesso negado."));
  }

  @Transactional
  public MaintenanceRequestResponse findById(Long id, Long customerId) {
    MaintenanceRequest req = findAndValidateOwnership(id, customerId);
    return new MaintenanceRequestResponse(req);
  }

  @Transactional
  public List<MaintenanceRequestResponse> listByCustomer(Long customerId) {
    return requestRepository.findByCustomerIdOrderByOpeningDateTimeAsc(customerId)
            .stream().map(MaintenanceRequestResponse::new).toList();
  }

  @Transactional
  public MaintenanceRequestResponse approveRequest(Long id, Long customerId) {
    MaintenanceRequest req = findAndValidateOwnership(id, customerId);

    if (req.getStatus() != RequestStatus.ORCADA) {
      throw new InvalidRequestStatusException("Apenas serviços no estado ORÇADA podem ser aprovados.");
    }

    req.setStatus(RequestStatus.APROVADA);

    historyService.register(req, RequestStatus.ORCADA, RequestStatus.APROVADA, customerId, "Orçamento aprovado pelo cliente.");
    requestRepository.save(req);
    return new MaintenanceRequestResponse(req);
  }

  @Transactional
  public MaintenanceRequestResponse rejectRequest(Long id, Long customerId, String reason) {
    MaintenanceRequest req = findAndValidateOwnership(id, customerId);

    if (req.getStatus() != RequestStatus.ORCADA) {
      throw new InvalidRequestStatusException("Apenas serviços no estado ORÇADA podem ser rejeitados.");
    }

    req.setStatus(RequestStatus.REJEITADA);
    req.setRejectionReason(reason);

    historyService.register(req, RequestStatus.ORCADA, RequestStatus.REJEITADA, customerId, "Serviço Rejeitado. Motivo: " + reason);
    requestRepository.save(req);
    return new MaintenanceRequestResponse(req);
  }

  @Transactional
  public MaintenanceRequestResponse rescueRequest(Long id, Long customerId) {
    MaintenanceRequest req = findAndValidateOwnership(id, customerId);
    if (req.getStatus() != RequestStatus.REJEITADA) {
      throw new InvalidRequestStatusException("Apenas serviços rejeitados podem ser resgatados.");
    }
    req.setStatus(RequestStatus.APROVADA);
    req.setRejectionReason(null);
    historyService.register(req, RequestStatus.REJEITADA, RequestStatus.APROVADA, customerId, "Serviço resgatado e aprovado pelo cliente.");
    requestRepository.save(req);
    return new MaintenanceRequestResponse(req);
  }

  @Transactional
  public MaintenanceRequestResponse payRequest(Long id, Long customerId) {
    MaintenanceRequest req = findAndValidateOwnership(id, customerId);
    if (req.getStatus() != RequestStatus.ARRUMADA) {
      throw new InvalidRequestStatusException("Impossível pagar: o equipamento não está no estado ARRUMADA.");
    }
    req.setStatus(RequestStatus.PAGA);
    req.setPaymentDateTime(LocalDateTime.now());
    historyService.register(req, RequestStatus.ARRUMADA, RequestStatus.PAGA, customerId, "Pagamento efetuado pelo cliente.");
    requestRepository.save(req);
    return new MaintenanceRequestResponse(req);

  }

  @Transactional
  public List<MaintenanceRequestResponse> listOpen() {
    return requestRepository.findByStatusOrderByOpeningDateTimeAsc(RequestStatus.ABERTA)
            .stream().map(MaintenanceRequestResponse::new).toList();
  }

  @Transactional
  public MaintenanceRequestResponse findByIdForEmployee(Long id) {
    MaintenanceRequest req = requestRepository.findById(id)
            .orElseThrow(() -> new RequestNotFoundException("Solicitação não encontrada."));
    return new MaintenanceRequestResponse(req);
  }
}