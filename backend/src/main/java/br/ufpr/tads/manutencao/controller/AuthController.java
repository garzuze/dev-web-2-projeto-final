package br.ufpr.tads.manutencao.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.ufpr.tads.manutencao.dto.LoginRequest;
import br.ufpr.tads.manutencao.dto.LoginResponse;
import br.ufpr.tads.manutencao.dto.SignUpRequest;
import br.ufpr.tads.manutencao.dto.SignUpResponse;
import br.ufpr.tads.manutencao.service.LoginService;
import br.ufpr.tads.manutencao.service.SignUpService;
import jakarta.validation.Valid;

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
