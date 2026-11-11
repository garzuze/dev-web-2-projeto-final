package br.ufpr.tads.manutencao.auth.dto;

public interface RegisterService {
  SignUpResponse signUp(SignUpRequest request);
}
