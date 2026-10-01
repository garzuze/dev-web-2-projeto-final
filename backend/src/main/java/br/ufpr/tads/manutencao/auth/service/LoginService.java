package br.ufpr.tads.manutencao.auth.service;

import br.ufpr.tads.manutencao.auth.dto.LoginRequest;
import br.ufpr.tads.manutencao.auth.dto.LoginResponse;
import br.ufpr.tads.manutencao.auth.dto.UserProfile;
import br.ufpr.tads.manutencao.auth.exception.InvalidCredentialsException;
import br.ufpr.tads.manutencao.model.Customer;
import br.ufpr.tads.manutencao.model.Employee;
import br.ufpr.tads.manutencao.model.User;
import br.ufpr.tads.manutencao.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoginService {

  private final UserRepository userRepository;
  private final PasswordService passwordService;

  public LoginService(UserRepository userRepository, PasswordService passwordService) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
  }

  @Transactional(readOnly = true)
  public LoginResponse login(LoginRequest request) {
    User user = userRepository.findByEmail(request.email().trim().toLowerCase())
            .orElseThrow(InvalidCredentialsException::new);

    if (!user.isActive()) {
      throw new InvalidCredentialsException();
    }

    if (!passwordService.matches(request.password(), user.getSalt(), user.getPasswordHash())) {
      throw new InvalidCredentialsException();
    }

    return new LoginResponse(user.getId(), user.getName(), user.getEmail(), profileOf(user));
  }

  private UserProfile profileOf(User user) {
    if (user instanceof Customer) {
      return UserProfile.CUSTOMER;
    }
    if (user instanceof Employee) {
      return UserProfile.EMPLOYEE;
    }
    throw new InvalidCredentialsException();
  }

}
