package br.ufpr.tads.manutencao.request.controller;

import br.ufpr.tads.manutencao.request.dto.MaintenanceRequestResponse;
import br.ufpr.tads.manutencao.request.dto.PerformMaintenanceRequest;
import br.ufpr.tads.manutencao.request.dto.QuoteRequest;
import br.ufpr.tads.manutencao.request.dto.RedirectRequest;
import br.ufpr.tads.manutencao.request.service.MaintenanceRequestService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestParam;
import java.time.LocalDate;

import java.util.List;

@RestController
@RequestMapping("/api/employee/requests")
public class EmployeeRequestController {
    private final MaintenanceRequestService maintenanceRequestService;

    public EmployeeRequestController(MaintenanceRequestService maintenanceRequestService) {
        this.maintenanceRequestService = maintenanceRequestService;
    }

    @GetMapping
    public List<MaintenanceRequestResponse> listAll(
            @RequestHeader("X-Current-User-Id") Long employeeId,
            @RequestParam(defaultValue = "ALL") String filterType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return maintenanceRequestService.listAllForEmployee(employeeId, filterType, startDate, endDate);
    }

    @GetMapping("/open")
    public List<MaintenanceRequestResponse> listOpen() {
        return maintenanceRequestService.listOpen();
    }

    @GetMapping("/{id}")
    public MaintenanceRequestResponse findById(@PathVariable Long id, @RequestHeader ("X-Current-User-Id") Long employeeId) {
        return maintenanceRequestService.findByIdForEmployee(id, employeeId);
    }

    @PutMapping("/{id}/quote")
    public MaintenanceRequestResponse quote(@PathVariable Long id,
                                            @RequestHeader("X-Current-User-Id") Long employeeId,
                                            @Valid @RequestBody QuoteRequest request) {
        return maintenanceRequestService.quoteRequest(id, employeeId, request.quoteValue());
    }

    @PutMapping("/{id}/maintenance")
    public MaintenanceRequestResponse performMaintenance(@PathVariable Long id,
                                                         @RequestHeader("X-Current-User-Id") Long employeeId,
                                                         @Valid @RequestBody PerformMaintenanceRequest request) {
        return maintenanceRequestService.performMaintenance(id, employeeId, request.maintenanceDescription(), request.customerInstructions());
    }

    @PutMapping("/{id}/redirect")
    public MaintenanceRequestResponse redirect(@PathVariable Long id,
                                               @RequestHeader("X-Current-User-Id") Long employeeId,
                                               @Valid @RequestBody RedirectRequest request) {
        return maintenanceRequestService.redirectRequest(id, employeeId, request.destinationEmployeeId());
    }

    @PutMapping("/{id}/finish")
    public MaintenanceRequestResponse finish(@PathVariable Long id,
                                             @RequestHeader("X-Current-User-Id") Long employeeId) {
        return maintenanceRequestService.finishRequest(id, employeeId);
    }
}
