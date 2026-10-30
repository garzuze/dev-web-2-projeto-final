package br.ufpr.tads.manutencao.auth.service;

import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;

class PasswordServiceTest {

  private final PasswordService service = new PasswordService();

  @Test
  void hashIsBase64Sha256OfSaltFollowedByPassword() throws Exception {
    byte[] expected = MessageDigest.getInstance("SHA-256")
            .digest("c2FsdA==1234".getBytes(StandardCharsets.UTF_8));

    assertThat(service.hash("1234", "c2FsdA=="))
            .isEqualTo(Base64.getEncoder().encodeToString(expected));
  }

  @Test
  void hashFitsTheColumnOfTheUsersTable() {
    // users.password_hash é varchar(44): 32 bytes em base64
    assertThat(service.hash("1234", service.generateSalt())).hasSize(44);
  }

  @Test
  void samePasswordWithDifferentSaltsGivesDifferentHashes() {
    assertThat(service.hash("1234", service.generateSalt()))
            .isNotEqualTo(service.hash("1234", service.generateSalt()));
  }

  @Test
  void saltFitsTheColumnAndIsNotRepeated() {
    // users.salt é varchar(24): 16 bytes em base64
    Set<String> salts = new HashSet<>();
    for (int i = 0; i < 100; i++) {
      String salt = service.generateSalt();
      assertThat(salt).hasSize(24);
      salts.add(salt);
    }
    assertThat(salts).hasSize(100);
  }

  @Test
  void generatedPasswordHasExactlyFourDigits() {
    for (int i = 0; i < 500; i++) {
      assertThat(service.generateNumericPassword()).matches("\\d{4}");
    }
  }

  @Test
  void matchesAcceptsTheRightPasswordOnly() {
    String salt = service.generateSalt();
    String hash = service.hash("1234", salt);

    assertThat(service.matches("1234", salt, hash)).isTrue();
    assertThat(service.matches("1235", salt, hash)).isFalse();
    assertThat(service.matches("1234", service.generateSalt(), hash)).isFalse();
  }

}
