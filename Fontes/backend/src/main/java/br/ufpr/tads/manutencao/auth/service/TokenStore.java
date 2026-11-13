package br.ufpr.tads.manutencao.auth.service;

import br.ufpr.tads.manutencao.auth.dto.LoginResponse;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

@Component
public class TokenStore {

  private final Map<String, LoginResponse> users = new ConcurrentHashMap<>();

  public void save(LoginResponse user) {
    users.put(user.token(), user);
  }

  public LoginResponse find(String token) {
    return token == null ? null : users.get(token);
  }

}
