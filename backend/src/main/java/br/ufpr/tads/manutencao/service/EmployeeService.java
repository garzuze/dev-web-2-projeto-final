package br.ufpr.tads.manutencao.service;

import br.ufpr.tads.manutencao.auth.service.PasswordNotifier;
import br.ufpr.tads.manutencao.auth.service.PasswordService;
import br.ufpr.tads.manutencao.dto.EmployeeRequest;
import br.ufpr.tads.manutencao.dto.EmployeeResponse;
import br.ufpr.tads.manutencao.repository.EmployeeRepository;
import br.ufpr.tads.manutencao.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

  private final EmployeeRepository employeeRepository;
  private final UserRepository userRepository;
  private final PasswordService passwordService;
  private final PasswordNotifier passwordNotifier;

  public EmployeeService(EmployeeRepository employeeRepository,
                         UserRepository userRepository,
                         PasswordService passwordService,
                         PasswordNotifier passwordNotifier) {
    this.employeeRepository = employeeRepository;
    this.userRepository = userRepository;
    this.passwordService = passwordService;
    this.passwordNotifier = passwordNotifier;
  }

  public List<EmployeeResponse> list() {
    // TODO: buscar e retornar funcionarios ativos ordenados por nome
    return List.of();
  }

  public EmployeeResponse create(EmployeeRequest request) {
    // TODO: validar email unico, gerar senha aleatoria, salvar e notificar por email
    return null;
  }

  public EmployeeResponse update(Long id, EmployeeRequest request) {
    // TODO: buscar funcionario ativo, validar email e atualizar os dados
    return null;
  }

  public void deactivate(Long id, Long currentUserId) {
    // TODO: validar auto-remocao e unico funcionario ativo antes de desativar
  }

}