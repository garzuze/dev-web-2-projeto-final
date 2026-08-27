package br.ufpr.tads.manutencao.service;

public interface PasswordDelivery {

  void send(String email, String password);

}
