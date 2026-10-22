package br.ufpr.tads.manutencao.request.service;

import br.ufpr.tads.manutencao.request.model.MaintenanceRequest;
import br.ufpr.tads.manutencao.request.model.RequestHistory;
import br.ufpr.tads.manutencao.request.model.RequestStatus;
import br.ufpr.tads.manutencao.user.service.CustomerService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RequestHistoryService {
  private final CustomerService customerService;

  public RequestHistoryService(CustomerService customerService) {
    this.customerService = customerService;
  }

  public void register(MaintenanceRequest req, RequestStatus previousStatus, RequestStatus newStatus, Long customerId, String message) {
    RequestHistory history = new RequestHistory();
    history.setRequest(req);
    history.setPreviousStatus(previousStatus);
    history.setNewStatus(newStatus);
    history.setDateTime(LocalDateTime.now());
    history.setAuthor(customerService.getById(customerId));
    history.setNotes(message);
    req.addHistory(history);
  }
}
