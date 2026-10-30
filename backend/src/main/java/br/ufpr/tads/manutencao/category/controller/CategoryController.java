package br.ufpr.tads.manutencao.category.controller;

import br.ufpr.tads.manutencao.category.dto.CategoryRequest;
import br.ufpr.tads.manutencao.category.dto.CategoryResponse;
import br.ufpr.tads.manutencao.category.service.CategoryService;
import br.ufpr.tads.manutencao.utils.CrudService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

  private final CrudService<CategoryRequest, CategoryResponse> categoryService;

  public CategoryController(CrudService<CategoryRequest, CategoryResponse> categoryService) {
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
