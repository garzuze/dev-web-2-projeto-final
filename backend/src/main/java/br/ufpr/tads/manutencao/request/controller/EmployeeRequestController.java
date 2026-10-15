package br.ufpr.tads.manutencao.request.controller;

import br.ufpr.tads.manutencao.request.dto.MaintenanceRequestResponse;
import br.ufpr.tads.manutencao.request.service.MaintenanceRequestService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/employee/requests")
public class EmployeeRequestController {
    private final MaintenanceRequestService maintenanceRequestService;

    public EmployeeRequestController(MaintenanceRequestService maintenanceRequestService) {
        this.maintenanceRequestService = maintenanceRequestService;
    }

    @GetMapping("/open")
    public List<MaintenanceRequestResponse> listOpen() {
        return maintenanceRequestService.listOpen();
    }

    @GetMapping("/{id}")
    public MaintenanceRequestResponse findById(@PathVariable Long id) {
        return maintenanceRequestService.findByIdForEmployee(id);
    }
}
