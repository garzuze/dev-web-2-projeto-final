package br.ufpr.tads.manutencao.request.dto;

import br.ufpr.tads.manutencao.request.model.MaintenanceRequest;
import br.ufpr.tads.manutencao.request.model.RequestStatus;
import br.ufpr.tads.manutencao.user.model.Employee;
import br.ufpr.tads.manutencao.user.model.User;

public record CreateRequestHistory(MaintenanceRequest request, RequestStatus previousStatus, RequestStatus newStatus,
                                   User author, Employee destinationEmployee, String notes) {
}
