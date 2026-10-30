package br.ufpr.tads.manutencao.user.service;

import br.ufpr.tads.manutencao.auth.exception.EmailAlreadyUsedException;
import br.ufpr.tads.manutencao.auth.service.PasswordNotifier;
import br.ufpr.tads.manutencao.auth.service.PasswordService;
import br.ufpr.tads.manutencao.user.dto.EmployeeRequest;
import br.ufpr.tads.manutencao.user.dto.EmployeeResponse;
import br.ufpr.tads.manutencao.user.mapper.EmployeeMapper;
import br.ufpr.tads.manutencao.user.model.Employee;
import br.ufpr.tads.manutencao.user.model.User;
import br.ufpr.tads.manutencao.user.repository.EmployeeRepository;
import br.ufpr.tads.manutencao.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


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

  @Transactional(readOnly = true) 
  public List<EmployeeResponse> list() {
    return employeeRepository.findByActiveTrueOrderByNameAsc()
           .stream()
           .map(EmployeeMapper::toResponse)
           .toList();
  }

  @Transactional 
  public EmployeeResponse create(EmployeeRequest request) {
    String email = request.email().trim().toLowerCase();

    if (userRepository.existsByEmail(email)) {
      throw new EmailAlreadyUsedException(email);
    }

    String password = passwordService.generateNumericPassword();
    String salt = passwordService.generateSalt();
    String hash = passwordService.hash(password, salt);

    Employee employee = employeeRepository.save(EmployeeMapper.toEntity(request, salt, hash));

    passwordNotifier.send(employee.getEmail(), password);

    return EmployeeMapper.toResponse(employee);
  }

  @Transactional 
  public EmployeeResponse update(Long id, EmployeeRequest request) {

    Employee employeeToBeUpdated = employeeRepository.findById(id)
                        .filter(Employee::isActive)
                        .orElseThrow(() -> new EntityNotFoundException("Funcionário não encontrado"));

    String email = request.email().trim().toLowerCase();                    
    Optional<User> user = userRepository.findByEmail(email);

    if (user.isPresent() && !user.get().getId().equals(id)) {
      throw new EmailAlreadyUsedException(email);
    }

    EmployeeMapper.updateEntity(employeeToBeUpdated, request);
    Employee employee = employeeRepository.save(employeeToBeUpdated);
    
    return EmployeeMapper.toResponse(employee);
  }

  @Transactional 
  public void deactivate(Long id, Long currentUserId) {
    if (id.equals(currentUserId)) {
      throw new IllegalStateException("Um funcionário não pode deletar a si mesmo.");
    }

    if (employeeRepository.countByActiveTrue() <= 1) {
      throw new IllegalStateException("Não foi possível deletar esse usuário.");
    }

    Employee deletedEmployee = employeeRepository.findById(id)
                               .filter(Employee::isActive)
                               .orElseThrow(() -> new EntityNotFoundException("Funcionário não encontrado"));

    deletedEmployee.setActive(false);
  }

}
