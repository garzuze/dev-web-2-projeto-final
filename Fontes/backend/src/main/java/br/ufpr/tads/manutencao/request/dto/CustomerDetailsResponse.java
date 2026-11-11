package br.ufpr.tads.manutencao.request.dto;

public record CustomerDetailsResponse(
        Long id,
        String name,
        String email,
        String cpf,
        String phone,
        AddressInfo address
) {
    public record AddressInfo(
            String zipCode,
            String street,
            String number,
            String complement,
            String district,
            String city,
            String state
    ) {}
}
