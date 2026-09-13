package br.ufpr.tads.manutencao.dto;

import br.ufpr.tads.manutencao.model.Category;

public record LoginResponse(Long id, String name, String email, UserProfile profile) {

  public static record CategoryResponse(Long id, String name) {

      public static CategoryResponse of(Category category) {
          return new CategoryResponse(category.getId(), category.getName());
      }

  }
}
