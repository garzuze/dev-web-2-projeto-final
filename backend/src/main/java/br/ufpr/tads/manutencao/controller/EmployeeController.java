package br.ufpr.tads.manutencao.controller;

import br.ufpr.tads.manutencao.dto.EmployeeRequest;
import br.ufpr.tads.manutencao.dto.EmployeeResponse;
import br.ufpr.tads.manutencao.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

  private final EmployeeService employeeService;

  public EmployeeController(EmployeeService employeeService) {
    this.employeeService = employeeService;
  }

  @GetMapping
  public List<EmployeeResponse> list() {
    return employeeService.list();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public EmployeeResponse create(@Valid @RequestBody EmployeeRequest request) {
    return employeeService.create(request);
  }

  @PutMapping("/{id}")
  public EmployeeResponse update(@PathVariable Long id, @Valid @RequestBody EmployeeRequest request) {
    return employeeService.update(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deactivate(@PathVariable Long id,
                         @RequestHeader(value = "X-Current-User-Id", required = false) Long currentUserId) {
    employeeService.deactivate(id, currentUserId);
  }

}
