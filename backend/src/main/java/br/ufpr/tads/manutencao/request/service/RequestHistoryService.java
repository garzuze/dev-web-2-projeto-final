package br.ufpr.tads.manutencao.request.service;

import br.ufpr.tads.manutencao.request.dto.CreateRequestHistory;
import br.ufpr.tads.manutencao.request.mapper.RequestHistoryMapper;
import br.ufpr.tads.manutencao.request.model.RequestHistory;
import org.springframework.stereotype.Service;

@Service
public class RequestHistoryService {
  public void register(CreateRequestHistory requestHistory) {
    RequestHistory history = RequestHistoryMapper.toEntity(requestHistory);
    // Isso faz sentido? É assim mesmo que é para fazer?
    requestHistory.request().addHistory(history);
  }
}
