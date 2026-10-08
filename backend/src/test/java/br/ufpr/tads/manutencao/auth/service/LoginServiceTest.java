package br.ufpr.tads.manutencao.auth.service;

import br.ufpr.tads.manutencao.auth.dto.LoginRequest;
import br.ufpr.tads.manutencao.auth.dto.LoginResponse;
import br.ufpr.tads.manutencao.auth.dto.UserProfile;
import br.ufpr.tads.manutencao.auth.exception.InvalidCredentialsException;
import br.ufpr.tads.manutencao.user.model.Customer;
import br.ufpr.tads.manutencao.user.model.Employee;
import br.ufpr.tads.manutencao.user.model.User;
import br.ufpr.tads.manutencao.user.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class LoginServiceTest {

  private final UserRepository userRepository = mock(UserRepository.class);
  private final PasswordService passwordService = new PasswordService();
  private final LoginService service = new LoginService(userRepository, passwordService);

  private <U extends User> U registered(U user, String password) {
    user.setId(1L);
    user.setName("Maria");
    user.setEmail("maria@example.com");
    user.setSalt(passwordService.generateSalt());
    user.setPasswordHash(passwordService.hash(password, user.getSalt()));
    when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
    return user;
  }

  @Test
  void customerLoginIgnoresEmailCaseAndSurroundingSpaces() {
    registered(new Customer(), "1234");

    LoginResponse response = service.login(new LoginRequest("  Maria@Example.COM ", "1234"));

    assertThat(response).isEqualTo(new LoginResponse(1L, "Maria", "maria@example.com", UserProfile.CUSTOMER));
  }

  @Test
  void employeeLoginReturnsEmployeeProfile() {
    registered(new Employee(), "1234");
    assertThat(service.login(new LoginRequest("maria@example.com", "1234")).profile())
            .isEqualTo(UserProfile.EMPLOYEE);
  }

  @Test
  void wrongPasswordIsRejected() {
    registered(new Customer(), "1234");
    assertThatThrownBy(() -> service.login(new LoginRequest("maria@example.com", "0000")))
            .isInstanceOf(InvalidCredentialsException.class);
  }

  @Test
  void inactiveUserIsRejectedEvenWithTheRightPassword() {
    registered(new Customer(), "1234").setActive(false);
    assertThatThrownBy(() -> service.login(new LoginRequest("maria@example.com", "1234")))
            .isInstanceOf(InvalidCredentialsException.class);
  }

  @Test
  void unknownEmailIsRejected() {
    assertThatThrownBy(() -> service.login(new LoginRequest("ghost@example.com", "1234")))
            .isInstanceOf(InvalidCredentialsException.class);
  }
  
}
