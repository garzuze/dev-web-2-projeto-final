package br.ufpr.tads.manutencao.request.service;

import br.ufpr.tads.manutencao.request.dto.MaintenanceRequestResponse;
import br.ufpr.tads.manutencao.request.exception.InvalidRequestStatusException;
import br.ufpr.tads.manutencao.request.exception.RequestNotFoundException;
import br.ufpr.tads.manutencao.request.model.MaintenanceRequest;
import br.ufpr.tads.manutencao.request.model.RequestHistory;
import br.ufpr.tads.manutencao.request.model.RequestStatus;
import br.ufpr.tads.manutencao.request.repository.MaintenanceRequestRepository;
import br.ufpr.tads.manutencao.request.repository.RequestHistoryRepository;
import br.ufpr.tads.manutencao.user.repository.CustomerRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MaintenanceRequestService {
    private final MaintenanceRequestRepository requestRepository;
    private final RequestHistoryRepository requestHistoryRepository;
    private final CustomerRepository customerRepository;

    public MaintenanceRequestService(MaintenanceRequestRepository requestRepository, RequestHistoryRepository requestHistoryRepository, CustomerRepository customerRepository) {
        this.requestRepository = requestRepository;
        this.requestHistoryRepository = requestHistoryRepository;
        this.customerRepository = customerRepository;
    }

    private MaintenanceRequest findAndValidateOwnership(Long requestId, Long customerId) {
        return requestRepository.findByIdAndCustomerId(requestId, customerId)
                .orElseThrow(() -> new RequestNotFoundException("Solicitação não encontrada ou acesso negado."));
    }

    private br.ufpr.tads.manutencao.user.model.Customer getCustomer(Long customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
    }

    private void registerHistory(MaintenanceRequest req, RequestStatus previousStatus, RequestStatus newStatus, Long customerId, String message){
        RequestHistory history = new RequestHistory();
        history.setRequest(req);
        history.setPreviousStatus(previousStatus);
        history.setNewStatus(newStatus);
        history.setDateTime(LocalDateTime.now());
        history.setAuthor(getCustomer(customerId));
        history.setNotes(message);
        req.addHistory(history);
    }

    @Transactional
    public MaintenanceRequestResponse approveRequest(Long id, Long customerId){
        MaintenanceRequest req = findAndValidateOwnership(id, customerId);

        if(req.getStatus() != RequestStatus.ORCADA){
            throw new InvalidRequestStatusException("Apenas serviços no estado ORÇADA podem ser aprovados.");
        }

        req.setStatus(RequestStatus.APROVADA);

        registerHistory(req, RequestStatus.ORCADA, RequestStatus.APROVADA, customerId, "Orçamento aprovado pelo cliente.");
        requestRepository.save(req);
        return new MaintenanceRequestResponse(req);
    }

    @Transactional
    public MaintenanceRequestResponse rejectRequest(Long id, Long customerId, String reason){
        MaintenanceRequest req = findAndValidateOwnership(id, customerId);

        if(req.getStatus() != RequestStatus.ORCADA){
            throw new InvalidRequestStatusException("Apenas serviços no estado ORÇADA podem ser rejeitados.");
        }

        req.setStatus(RequestStatus.REJEITADA);
        req.setRejectionReason(reason);

        registerHistory(req, RequestStatus.ORCADA, RequestStatus.REJEITADA, customerId, "Serviço Rejeitado. Motivo: " + reason);
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
        registerHistory(req, RequestStatus.REJEITADA, RequestStatus.APROVADA, customerId, "Serviço resgatado e aprovado pelo cliente.");
        requestRepository.save(req);
        return new MaintenanceRequestResponse(req);
    }


    @Transactional
    public MaintenanceRequestResponse payRequest(Long id, Long customerId){
        MaintenanceRequest req = findAndValidateOwnership(id, customerId);
        if (req.getStatus() != RequestStatus.ARRUMADA) {
            throw new InvalidRequestStatusException("Impossível pagar: o equipamento não está no estado ARRUMADA.");
        }
        req.setStatus(RequestStatus.PAGA);
        req.setPaymentDateTime(LocalDateTime.now());
        registerHistory(req, RequestStatus.ARRUMADA, RequestStatus.PAGA, customerId, "Pagamento efetuado pelo cliente.");
        requestRepository.save(req);
        return new MaintenanceRequestResponse(req);

    }
}