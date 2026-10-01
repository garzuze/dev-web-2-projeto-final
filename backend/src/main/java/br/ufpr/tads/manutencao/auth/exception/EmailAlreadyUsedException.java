package br.ufpr.tads.manutencao.auth.exception;

public class EmailAlreadyUsedException extends RuntimeException {

  public EmailAlreadyUsedException(String email) {
    super("Já existe um usuário cadastrado com o e-mail " + email);
  }

}
