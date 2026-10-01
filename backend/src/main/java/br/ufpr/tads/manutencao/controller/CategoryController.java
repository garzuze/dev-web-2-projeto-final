package br.ufpr.tads.manutencao.controller;

import br.ufpr.tads.manutencao.dto.CategoryRequest;
import br.ufpr.tads.manutencao.dto.CategoryResponse;
import br.ufpr.tads.manutencao.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

  private final CategoryService categoryService;

  public CategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  @GetMapping
  public List<CategoryResponse> list() {
    return categoryService.list();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public CategoryResponse create(@Valid @RequestBody CategoryRequest request) {
    return categoryService.create(request);
  }

  @PutMapping("/{id}")
  public CategoryResponse update(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
    return categoryService.update(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deactivate(@PathVariable Long id) {
    categoryService.deactivate(id);
  }

}
