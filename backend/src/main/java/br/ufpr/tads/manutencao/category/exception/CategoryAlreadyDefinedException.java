package br.ufpr.tads.manutencao.category.exception;

import br.ufpr.tads.manutencao.category.model.Category;

public class CategoryAlreadyDefinedException extends RuntimeException {
  public CategoryAlreadyDefinedException(Category existing) {
    super("Já existe uma categoria ativa com o nome \"" + existing.getName()
            + "\". Escolha outro nome ou edite a categoria existente.");
  }
}
