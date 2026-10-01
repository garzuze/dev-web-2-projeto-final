package br.ufpr.tads.manutencao.auth.dto;

public record LoginResponse(
        Long id,
        String name,
        String email, UserProfile profile
) {
}
