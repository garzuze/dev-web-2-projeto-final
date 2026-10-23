package br.ufpr.tads.manutencao.request.service;

import br.ufpr.tads.manutencao.category.model.Category;
import br.ufpr.tads.manutencao.category.service.CategoryService;
import br.ufpr.tads.manutencao.request.dto.CreateRequest;
import br.ufpr.tads.manutencao.request.dto.MaintenanceRequestResponse;
import br.ufpr.tads.manutencao.request.model.MaintenanceRequest;
import br.ufpr.tads.manutencao.request.model.RequestStatus;
import br.ufpr.tads.manutencao.request.repository.MaintenanceRequestRepository;
import br.ufpr.tads.manutencao.user.service.CustomerService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CreateMaintenanceRequestService {
  private final MaintenanceRequestRepository requestRepository;
  private final CategoryService categoryService;
  private final RequestHistoryService historyService;
  private final CustomerService customerService;

  public CreateMaintenanceRequestService(MaintenanceRequestRepository requestRepository,
                                         CategoryService categoryService,
                                         RequestHistoryService historyService,
                                         CustomerService customerService) {
    this.requestRepository = requestRepository;
    this.historyService = historyService;
    this.categoryService = categoryService;
    this.customerService = customerService;
  }

  @Transactional
  public MaintenanceRequestResponse execute(Long customerId, CreateRequest request) {
    Category category = categoryService.activeById(request.categoryId());
    MaintenanceRequest req = new MaintenanceRequest();
    req.setCustomer(customerService.getById(customerId));
    req.setCategory(category);
    req.setEquipmentDescription(request.equipmentDescription().trim());
    req.setDefectDescription(request.defectDescription().trim());
    req.setStatus(RequestStatus.ABERTA);
    req.setOpeningDateTime(LocalDateTime.now());

    historyService.register(req,
            null,
            RequestStatus.ABERTA,
            req.getCustomer(),
            "Solicitação aberta pelo cliente.");
    requestRepository.save(req);
    return new MaintenanceRequestResponse(req);
  }
}
