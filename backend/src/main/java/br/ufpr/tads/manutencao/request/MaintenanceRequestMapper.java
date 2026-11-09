package br.ufpr.tads.manutencao.request;

import br.ufpr.tads.manutencao.category.model.Category;
import br.ufpr.tads.manutencao.request.dto.CreateRequest;
import br.ufpr.tads.manutencao.request.dto.CustomerDetailsResponse;
import br.ufpr.tads.manutencao.request.dto.MaintenanceRequestResponse;
import br.ufpr.tads.manutencao.request.dto.RequestHistoryResponse;
import br.ufpr.tads.manutencao.request.model.MaintenanceRequest;
import br.ufpr.tads.manutencao.request.model.RequestHistory;
import br.ufpr.tads.manutencao.request.model.RequestStatus;
import br.ufpr.tads.manutencao.user.model.Address;
import br.ufpr.tads.manutencao.user.model.Customer;

import java.time.LocalDateTime;

public class MaintenanceRequestMapper {
  public static MaintenanceRequest fromCreateRequestToEntity(CreateRequest request, Customer customer,
      Category category, RequestStatus status) {
    return MaintenanceRequest.builder()
        .customer(customer)
        .category(category)
        .status(status)
        .equipmentDescription(request.equipmentDescription().trim())
        .defectDescription(request.defectDescription().trim())
        .openingDateTime(LocalDateTime.now())
        .build();
  }

  public static MaintenanceRequestResponse toResponse(MaintenanceRequest request) {
    return buildResponse(request, null);
  }

  // Poderia ser um overload de toResponse, mas para ficar mais claro o que faz escolhi manter nomes diferentes
  public static MaintenanceRequestResponse toEmployeeDetailsResponse(MaintenanceRequest request, Address adress) {
    Customer customer = request.getCustomer();
    CustomerDetailsResponse clientDetails = null;

    if (customer != null) {
      CustomerDetailsResponse.AddressInfo addressInfo = adress != null ? new CustomerDetailsResponse.AddressInfo(
          adress.getZipCode(),
          adress.getStreet(),
          adress.getNumber(),
          adress.getComplement(),
          adress.getDistrict(),
          adress.getCity(),
          adress.getState()) : null;

      clientDetails = new CustomerDetailsResponse(
          customer.getId(),
          customer.getName(),
          customer.getEmail(),
          customer.getCpf(),
          customer.getPhone(),
          addressInfo);
    }

    return buildResponse(request, clientDetails);
  }

  private static MaintenanceRequestResponse buildResponse(MaintenanceRequest request,
      CustomerDetailsResponse clientDetails) {
    Long customerId = request.getCustomer() != null ? request.getCustomer().getId() : null;
    String customerName = request.getCustomer() != null ? request.getCustomer().getName() : null;
    String employeeName = request.getEmployee() != null ? request.getEmployee().getName() : null;

    return new MaintenanceRequestResponse(
        request.getId(),
        request.getOpeningDateTime(),
        request.getStatus().name(),
        customerId,
        customerName,
        request.getCategory().getName(),
        request.getEquipmentDescription(),
        request.getDefectDescription(),
        request.getQuoteValue(),
        request.getRejectionReason(),
        employeeName,
        // Acho que isso aqui não está legal... Talvez substituir por uma query/avaliar
        // se realmente precisa disso
        request.getHistory() != null ? request.getHistory().stream()
            .filter(h -> h.getNewStatus() == RequestStatus.ARRUMADA)
            .map(RequestHistory::getDateTime)
            .reduce((a, b) -> b)
            .orElse(null) : null,
        request.getMaintenanceDescription(),
        request.getCustomerInstructions(),
        request.getPaymentDateTime(),
        // Isso também não está legal
        request.getHistory() != null ? request.getHistory().stream().map(RequestHistoryResponse::new).toList() : null,
        clientDetails);
  }
}
