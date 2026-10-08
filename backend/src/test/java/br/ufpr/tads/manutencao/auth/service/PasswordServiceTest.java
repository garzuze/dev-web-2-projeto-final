package br.ufpr.tads.manutencao.auth.service;

import org.junit.jupiter.api.Test;

import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;

class PasswordServiceTest {

  private final PasswordService passwordService = new PasswordService();

  @Test
  void generateNumericPasswordHasFourDigits() {
    for (int i = 0; i < 200; i++) {
      assertThat(passwordService.generateNumericPassword()).matches("\\d{4}");
    }
  }

  @Test
  void generateSaltEncodesSixteenRandomBytes() {
    String salt = passwordService.generateSalt();

    assertThat(Base64.getDecoder().decode(salt)).hasSize(16);
    assertThat(passwordService.generateSalt()).isNotEqualTo(salt);
  }

  @Test
  void hashIsDeterministicAndDependsOnTheSalt() {
    String hash = passwordService.hash("1234", "salt-a");

    assertThat(passwordService.hash("1234", "salt-a")).isEqualTo(hash);
    assertThat(passwordService.hash("1234", "salt-b")).isNotEqualTo(hash);
  }

  @Test
  void matchesAcceptsOnlyTheOriginalPassword() {
    String salt = passwordService.generateSalt();
    String hash = passwordService.hash("1234", salt);

    assertThat(passwordService.matches("1234", salt, hash)).isTrue();
    assertThat(passwordService.matches("4321", salt, hash)).isFalse();
  }

}
