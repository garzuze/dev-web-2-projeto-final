package br.ufpr.tads.manutencao.exception;

import br.ufpr.tads.manutencao.auth.exception.EmailAlreadyUsedException;
import br.ufpr.tads.manutencao.auth.exception.InvalidCredentialsException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import static org.assertj.core.api.Assertions.assertThat;

class ApiExceptionHandlerTest {

  private final ApiExceptionHandler handler = new ApiExceptionHandler();

  @Test
  void duplicatedEmailIsAConflict() {
    ProblemDetail problem = handler.handleAlreadyUsed(new EmailAlreadyUsedException("a@b.com"));

    assertThat(problem.getStatus()).isEqualTo(HttpStatus.CONFLICT.value());
    assertThat(problem.getDetail()).contains("a@b.com");
  }

  @Test
  void invalidCredentialsAreUnauthorized() {
    ProblemDetail problem = handler.handleInvalidCredentials(new InvalidCredentialsException());

    assertThat(problem.getStatus()).isEqualTo(HttpStatus.UNAUTHORIZED.value());
  }

}
