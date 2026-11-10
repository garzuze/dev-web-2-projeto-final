package br.ufpr.tads.manutencao.auth.controller;

import br.ufpr.tads.manutencao.auth.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final RegisterService signUpService;
  private final AuthService loginService;

  public AuthController(RegisterService signUpService, AuthService loginService) {
    this.signUpService = signUpService;
    this.loginService = loginService;
  }

  @PostMapping("/sign-up")
  @ResponseStatus(HttpStatus.CREATED)
  public SignUpResponse signUp(@Valid @RequestBody SignUpRequest request) {
    return signUpService.signUp(request);
  }

  @PostMapping("/login")
  public LoginResponse login(@Valid @RequestBody LoginRequest request) {
    return loginService.login(request);
  }

}
