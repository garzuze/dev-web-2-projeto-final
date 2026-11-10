package br.ufpr.tads.manutencao.utils.dto;

import br.ufpr.tads.manutencao.category.model.Category;
import br.ufpr.tads.manutencao.request.model.RequestStatus;
import br.ufpr.tads.manutencao.user.model.Customer;
import br.ufpr.tads.manutencao.user.model.Employee;

public record SeedRequest(
        Customer customer,
        Category category,
        String equipment,
        String description,
        RequestStatus state,
        Employee employee,
        Employee destinyEmployee,
        String value,
        int dias) {
}
