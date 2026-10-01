package br.ufpr.tads.manutencao.auth.exception;

public class InvalidCredentialsException extends RuntimeException {

  public InvalidCredentialsException() {
    super("E-mail ou senha inválidos");
  }

}
