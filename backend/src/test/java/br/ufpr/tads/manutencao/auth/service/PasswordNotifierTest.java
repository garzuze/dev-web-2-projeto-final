package br.ufpr.tads.manutencao.auth.service;

import br.ufpr.tads.manutencao.auth.dto.UserProfile;
import br.ufpr.tads.manutencao.utils.EmailService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatNoException;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class PasswordNotifierTest {

  private final EmailService emailService = mock(EmailService.class);
  private final PasswordNotifier notifier = new PasswordNotifier(emailService);

  @Test
  void sendsCustomerSpecificEmailWithPasswordAndFirstName() {
    notifier.send("João da Silva", "joao@cliente.com", "1234", UserProfile.CUSTOMER);

    ArgumentCaptor<String> toCaptor = ArgumentCaptor.forClass(String.class);
    ArgumentCaptor<String> subjectCaptor = ArgumentCaptor.forClass(String.class);
    ArgumentCaptor<String> bodyCaptor = ArgumentCaptor.forClass(String.class);

    verify(emailService).enviaEmail(toCaptor.capture(), subjectCaptor.capture(), bodyCaptor.capture());

    assertThat(toCaptor.getValue()).isEqualTo("joao@cliente.com");
    assertThat(subjectCaptor.getValue()).isEqualTo("Senha de Acesso - Manutenção Zica 😎");
    assertThat(bodyCaptor.getValue())
            .contains("Olá João!")
            .contains("Muito obrigado por se cadastrar")
            .contains("Sua senha de acesso é: 1234");
  }

  @Test
  void sendsEmployeeSpecificEmailWithPasswordAndFirstName() {
    notifier.send("Maria Souza", "maria@empresa.com", "4321", UserProfile.EMPLOYEE);

    ArgumentCaptor<String> toCaptor = ArgumentCaptor.forClass(String.class);
    ArgumentCaptor<String> subjectCaptor = ArgumentCaptor.forClass(String.class);
    ArgumentCaptor<String> bodyCaptor = ArgumentCaptor.forClass(String.class);

    verify(emailService).enviaEmail(toCaptor.capture(), subjectCaptor.capture(), bodyCaptor.capture());

    assertThat(toCaptor.getValue()).isEqualTo("maria@empresa.com");
    assertThat(subjectCaptor.getValue()).isEqualTo("Senha de Acesso - Manutenção Zica 😎");
    assertThat(bodyCaptor.getValue())
            .contains("Olá Maria!")
            .contains("Você foi cadastrado como colaborador")
            .contains("Sua senha de acesso é: 4321")
            .doesNotContain("Muito obrigado por se cadastrar");
  }

  @Test
  void doesNotPropagateExceptionWhenEmailSendingFails() {
    doThrow(new RuntimeException("Servidor SMTP indisponível"))
            .when(emailService)
            .enviaEmail(anyString(), anyString(), anyString());

    assertThatNoException().isThrownBy(() ->
            notifier.send("Mário Santos", "mario@empresa.com", "9999", UserProfile.EMPLOYEE)
    );
  }

}
