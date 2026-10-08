package br.ufpr.tads.manutencao.request.controller;

import br.ufpr.tads.manutencao.request.dto.MaintenanceRequestResponse;
import br.ufpr.tads.manutencao.request.dto.RejectRequest;
import br.ufpr.tads.manutencao.request.service.MaintenanceRequestService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requests")
public class MaintenanceRequestController {
    private final MaintenanceRequestService maintenanceRequestService;

    public MaintenanceRequestController(MaintenanceRequestService maintenanceRequestService) {
        this.maintenanceRequestService = maintenanceRequestService;
    }

    @PutMapping("/{id}/approve")
    public MaintenanceRequestResponse approve(@PathVariable Long id, @RequestHeader("X-Current-User-Id") Long customerId){
        return maintenanceRequestService.approveRequest(id, customerId);
    }

    @PutMapping("/{id}/reject")
    public MaintenanceRequestResponse reject(@PathVariable Long id, @RequestHeader("X-Current-User-Id") Long customerId, @Valid @RequestBody RejectRequest request){
        return maintenanceRequestService.rejectRequest(id, customerId, request.rejectionReason());
    }

    @PutMapping("/{id}/rescue")
    public MaintenanceRequestResponse rescue(@PathVariable Long id, @RequestHeader("X-Current-User-Id") Long customerId){
        return maintenanceRequestService.rescueRequest(id, customerId);
    }

    @PutMapping("/{id}/pay")
    public MaintenanceRequestResponse pay(@PathVariable Long id, @RequestHeader("X-Current-User-Id") Long customerId){
        return maintenanceRequestService.payRequest(id, customerId);
    }
}