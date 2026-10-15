package br.ufpr.tads.manutencao.request.controller;

import br.ufpr.tads.manutencao.request.dto.CreateRequest;
import br.ufpr.tads.manutencao.request.dto.MaintenanceRequestResponse;
import br.ufpr.tads.manutencao.request.dto.RejectRequest;
import br.ufpr.tads.manutencao.request.service.MaintenanceRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class MaintenanceRequestController {
    private final MaintenanceRequestService maintenanceRequestService;

    public MaintenanceRequestController(MaintenanceRequestService maintenanceRequestService) {
        this.maintenanceRequestService = maintenanceRequestService;
    }

    @GetMapping("/{id}")
    public MaintenanceRequestResponse findById(@PathVariable Long id,
                                               @RequestHeader("X-Current-User-Id") Long customerId){
        return maintenanceRequestService.findById(id, customerId);
    }

    @GetMapping()
    public List<MaintenanceRequestResponse> listByCustomer(@RequestHeader("X-Current-User-Id") Long customerId){
        return maintenanceRequestService.listByCustomer(customerId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MaintenanceRequestResponse create(@RequestHeader("X-Current-User-Id") Long customerId, @Valid @RequestBody CreateRequest request){
        return maintenanceRequestService.createRequest(customerId, request);
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