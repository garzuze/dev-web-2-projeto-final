package br.ufpr.tads.manutencao.auth.service;

import br.ufpr.tads.manutencao.auth.dto.AuthService;
import br.ufpr.tads.manutencao.auth.dto.LoginRequest;
import br.ufpr.tads.manutencao.auth.dto.LoginResponse;
import br.ufpr.tads.manutencao.auth.dto.UserProfile;
import br.ufpr.tads.manutencao.auth.exception.InvalidCredentialsException;
import br.ufpr.tads.manutencao.user.model.Customer;
import br.ufpr.tads.manutencao.user.model.Employee;
import br.ufpr.tads.manutencao.user.model.User;
import br.ufpr.tads.manutencao.user.repository.UserRepository;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoginService implements AuthService {

  private final UserRepository userRepository;
  private final PasswordService passwordService;
  private final TokenStore tokenStore;

  public LoginService(UserRepository userRepository, PasswordService passwordService, TokenStore tokenStore) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
    this.tokenStore = tokenStore;
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

    LoginResponse response = new LoginResponse(user.getId(), user.getName(), user.getEmail(),
            profileOf(user), UUID.randomUUID().toString());
    tokenStore.save(response);
    return response;
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
