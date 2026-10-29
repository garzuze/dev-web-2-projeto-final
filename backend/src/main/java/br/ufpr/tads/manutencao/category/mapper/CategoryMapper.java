package br.ufpr.tads.manutencao.category.mapper;

import br.ufpr.tads.manutencao.category.dto.CategoryRequest;
import br.ufpr.tads.manutencao.category.dto.CategoryResponse;
import br.ufpr.tads.manutencao.category.model.Category;

public class CategoryMapper {
  public static Category toEntity(CategoryRequest categoryRequest) {
    return Category.builder()
            .name(categoryRequest.name().trim())
            .build();
  }

  public static Category toEntity(String name) {
    return Category.builder()
            .name(name)
            .build();
  }

  public static CategoryResponse toResponse(Category category) {
    return new CategoryResponse(category.getId(), category.getName());
  }
}
