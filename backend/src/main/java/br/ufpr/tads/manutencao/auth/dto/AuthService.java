package br.ufpr.tads.manutencao.auth.dto;

public interface AuthService {
  LoginResponse login(LoginRequest request);
}
