package br.ufpr.tads.manutencao.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class LogPasswordDelivery implements PasswordDelivery {

  private static final Logger log = LoggerFactory.getLogger(LogPasswordDelivery.class);

  @Override
  public void send(String email, String password) {
    log.info("Senha gerada para {}: {}", email, password);
  }

}
