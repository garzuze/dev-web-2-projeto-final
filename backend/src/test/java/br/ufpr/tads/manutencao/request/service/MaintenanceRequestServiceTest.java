package br.ufpr.tads.manutencao.request.service;

import br.ufpr.tads.manutencao.category.model.Category;
import br.ufpr.tads.manutencao.request.dto.MaintenanceRequestResponse;
import br.ufpr.tads.manutencao.request.exception.InvalidRequestStatusException;
import br.ufpr.tads.manutencao.request.model.MaintenanceRequest;
import br.ufpr.tads.manutencao.request.model.RequestHistory;
import br.ufpr.tads.manutencao.request.model.RequestStatus;
import br.ufpr.tads.manutencao.request.repository.AddressRepository;
import br.ufpr.tads.manutencao.request.repository.MaintenanceRequestRepository;
import br.ufpr.tads.manutencao.user.model.Customer;
import br.ufpr.tads.manutencao.user.model.Employee;
import br.ufpr.tads.manutencao.user.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class MaintenanceRequestServiceTest {

  private final MaintenanceRequestRepository requestRepository = mock(MaintenanceRequestRepository.class);
  private final EmployeeRepository employeeRepository = mock(EmployeeRepository.class);
  private final AddressRepository addressRepository = mock(AddressRepository.class);
  private final MaintenanceRequestService service = new MaintenanceRequestService(requestRepository,
      new RequestHistoryService(), employeeRepository, addressRepository);

  private Employee maria;
  private Employee mario;

  @BeforeEach
  void setUp() {
    maria = employee(1L, "Maria Silva");
    mario = employee(2L, "Mário Santos");
  }

  private Employee employee(Long id, String name) {
    Employee employee = Employee.builder().id(id).name(name).build();
    when(employeeRepository.findById(id)).thenReturn(Optional.of(employee));
    return employee;
  }

  private MaintenanceRequest request(RequestStatus status, Employee employee) {
    MaintenanceRequest request = MaintenanceRequest.builder()
        .id(10L)
        .customer(Customer.builder().id(5L).name("João").build())
        .category(Category.builder().id(1L).name("Notebook").build())
        .status(status)
        .employee(employee)
        .equipmentDescription("Notebook Dell")
        .defectDescription("Não liga")
        .openingDateTime(LocalDateTime.now())
        .history(new ArrayList<>())
        .build();
    when(requestRepository.findById(10L)).thenReturn(Optional.of(request));
    return request;
  }

  private RequestHistory lastHistory(MaintenanceRequest request) {
    return request.getHistory().getLast();
  }

  @Test
  void performMaintenanceOnApprovedRequestMovesItToFixed() {
    MaintenanceRequest request = request(RequestStatus.APROVADA, maria);

    MaintenanceRequestResponse response = service.performMaintenance(10L, 2L, " Troca da fonte ",
        "Não deixar na tomada");

    assertThat(response.statusName()).isEqualTo("ARRUMADA");
    assertThat(request.getMaintenanceDescription()).isEqualTo("Troca da fonte");
    assertThat(request.getEmployee()).isEqualTo(mario);
    assertThat(response.maintenanceDateTime()).isNotNull();
    assertThat(lastHistory(request).getAuthor()).isEqualTo(mario);
    assertThat(lastHistory(request).getPreviousStatus()).isEqualTo(RequestStatus.APROVADA);
  }

  @Test
  void onlyTheDestinationEmployeeCanFixARedirectedRequest() {
    request(RequestStatus.REDIRECIONADA, mario);

    assertThatThrownBy(() -> service.performMaintenance(10L, 1L, "Troca da fonte", "Nada"))
        .isInstanceOf(InvalidRequestStatusException.class);
  }

  @Test
  void openRequestCannotReceiveMaintenance() {
    request(RequestStatus.ABERTA, null);

    assertThatThrownBy(() -> service.performMaintenance(10L, 1L, "Troca da fonte", "Nada"))
        .isInstanceOf(InvalidRequestStatusException.class);
  }

  @Test
  void redirectKeepsOriginAndDestinationInHistory() {
    MaintenanceRequest request = request(RequestStatus.APROVADA, maria);

    MaintenanceRequestResponse response = service.redirectRequest(10L, 1L, 2L);

    assertThat(response.statusName()).isEqualTo("REDIRECIONADA");
    assertThat(request.getEmployee()).isEqualTo(mario);
    assertThat(lastHistory(request).getAuthor()).isEqualTo(maria);
    assertThat(lastHistory(request).getDestinationEmployee()).isEqualTo(mario);
  }

  @Test
  void redirectedRequestCanBeRedirectedAgain() {
    MaintenanceRequest request = request(RequestStatus.REDIRECIONADA, mario);

    service.redirectRequest(10L, 2L, 1L);

    assertThat(request.getEmployee()).isEqualTo(maria);
    assertThat(lastHistory(request).getPreviousStatus()).isEqualTo(RequestStatus.REDIRECIONADA);
  }

  @Test
  void cannotRedirectToYourself() {
    request(RequestStatus.APROVADA, maria);

    assertThatThrownBy(() -> service.redirectRequest(10L, 1L, 1L))
        .isInstanceOf(InvalidRequestStatusException.class);
  }

  @Test
  void finishOnlyWorksOnPaidRequests() {
    MaintenanceRequest request = request(RequestStatus.PAGA, mario);

    MaintenanceRequestResponse response = service.finishRequest(10L, 1L);

    assertThat(response.statusName()).isEqualTo("FINALIZADA");
    assertThat(lastHistory(request).getAuthor()).isEqualTo(maria);

    request(RequestStatus.ARRUMADA, mario);
    assertThatThrownBy(() -> service.finishRequest(10L, 1L))
        .isInstanceOf(InvalidRequestStatusException.class);
  }
}
