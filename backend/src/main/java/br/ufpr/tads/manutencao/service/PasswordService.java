package br.ufpr.tads.manutencao.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

import org.springframework.stereotype.Service;

@Service
public class PasswordService {

  private static final String ALGORITHM = "SHA-256";
  private static final int SALT_LENGTH_IN_BYTES = 16;
  private static final int PASSWORD_UPPER_BOUND = 10000;

  private final SecureRandom random = new SecureRandom();
  private final Base64.Encoder encoder = Base64.getEncoder();

  public String generateSalt() {
    byte[] salt = new byte[SALT_LENGTH_IN_BYTES];
    random.nextBytes(salt);
    return encoder.encodeToString(salt);
  }

  public String generateNumericPassword() {
    return String.format("%04d", random.nextInt(PASSWORD_UPPER_BOUND));
  }

  public String hash(String rawPassword, String salt) {
    try {
      MessageDigest digest = MessageDigest.getInstance(ALGORITHM);
      byte[] hashed = digest.digest((salt + rawPassword).getBytes(StandardCharsets.UTF_8));
      return encoder.encodeToString(hashed);
    } catch (NoSuchAlgorithmException cause) {
      throw new IllegalStateException(ALGORITHM + " is not available in this JVM", cause);
    }
  }

  public boolean matches(String rawPassword, String salt, String expectedHash) {
    byte[] candidate = hash(rawPassword, salt).getBytes(StandardCharsets.UTF_8);
    byte[] expected = expectedHash.getBytes(StandardCharsets.UTF_8);
    return MessageDigest.isEqual(candidate, expected);
  }

}
