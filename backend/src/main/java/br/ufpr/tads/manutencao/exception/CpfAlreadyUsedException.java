package br.ufpr.tads.manutencao.exception;

public class CpfAlreadyUsedException extends RuntimeException {

    public CpfAlreadyUsedException(String cpf) {
        super("Já existe um cliente cadastrado com o CPF " + cpf);
    }

}
