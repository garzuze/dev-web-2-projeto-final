package br.ufpr.tads.manutencao.request.service;

import br.ufpr.tads.manutencao.request.model.MaintenanceRequest;
import br.ufpr.tads.manutencao.request.model.RequestHistory;
import br.ufpr.tads.manutencao.request.model.RequestStatus;
import br.ufpr.tads.manutencao.user.model.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RequestHistoryService {

  public void register(MaintenanceRequest req, RequestStatus previousStatus, RequestStatus newStatus, User author, String message) {
    RequestHistory history = new RequestHistory();
    history.setRequest(req);
    history.setPreviousStatus(previousStatus);
    history.setNewStatus(newStatus);
    history.setDateTime(LocalDateTime.now());
    history.setAuthor(author);
    history.setNotes(message);
    req.addHistory(history);
  }
}
