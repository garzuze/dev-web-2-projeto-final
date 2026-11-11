package br.ufpr.tads.manutencao.user.dto;

import br.ufpr.tads.manutencao.utils.CrudService;

public interface EmployeeCrudService extends CrudService<EmployeeRequest, EmployeeResponse> {
  void deactivate(Long id, Long currentUserId);
}
