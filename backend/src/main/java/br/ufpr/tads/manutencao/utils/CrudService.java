package br.ufpr.tads.manutencao.utils;

import java.util.List;
// T: request, U: response
public interface CrudService<T, U> {
  List<U> list();
  U create(T request);
  U update(Long id, T request);
  void deactivate(Long id);
}
