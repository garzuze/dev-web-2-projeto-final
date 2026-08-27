package br.ufpr.tads.manutencao.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.ufpr.tads.manutencao.dto.LoginRequest;
import br.ufpr.tads.manutencao.dto.LoginResponse;
import br.ufpr.tads.manutencao.dto.UserProfile;
import br.ufpr.tads.manutencao.exception.InvalidCredentialsException;
import br.ufpr.tads.manutencao.model.Customer;
import br.ufpr.tads.manutencao.model.User;
import br.ufpr.tads.manutencao.repository.UserRepository;

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
    return UserProfile.EMPLOYEE;
  }

}
