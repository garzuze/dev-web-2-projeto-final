package br.ufpr.tads.manutencao.auth.controller;

import br.ufpr.tads.manutencao.auth.dto.LoginRequest;
import br.ufpr.tads.manutencao.auth.dto.LoginResponse;
import br.ufpr.tads.manutencao.auth.dto.SignUpRequest;
import br.ufpr.tads.manutencao.auth.dto.SignUpResponse;
import br.ufpr.tads.manutencao.auth.service.LoginService;
import br.ufpr.tads.manutencao.auth.service.SignUpService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final SignUpService signUpService;
  private final LoginService loginService;

  public AuthController(SignUpService signUpService, LoginService loginService) {
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
