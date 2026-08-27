package br.ufpr.tads.manutencao.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class PasswordNotifier {

  private static final Logger log = LoggerFactory.getLogger(PasswordNotifier.class);

  public void send(String email, String password) {
    log.info("Generated password for {}: {}", email, password);
  }

}
