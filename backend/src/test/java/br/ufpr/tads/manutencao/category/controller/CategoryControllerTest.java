package br.ufpr.tads.manutencao.category.controller;

import br.ufpr.tads.manutencao.category.model.Category;
import br.ufpr.tads.manutencao.category.repository.CategoryRepository;
import br.ufpr.tads.manutencao.category.service.CategoryService;
import br.ufpr.tads.manutencao.exception.ApiExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class CategoryControllerTest {

  private final CategoryRepository repository = mock(CategoryRepository.class);
  private final MockMvc mvc = MockMvcBuilders
          .standaloneSetup(new CategoryController(new CategoryService(repository)))
          .setControllerAdvice(new ApiExceptionHandler())
          .build();

  private Category category(long id, String name) {
    return Category.builder().id(id).name(name).build();
  }

  private ResultActions create(String name) throws Exception {
    return mvc.perform(post("/api/categories")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\":\"" + name + "\"}"));
  }

  private ResultActions rename(long id, String name) throws Exception {
    return mvc.perform(put("/api/categories/" + id)
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\":\"" + name + "\"}"));
  }

  @Test
  void creatingWithTheNameOfAnActiveCategoryAnswersConflictWithTheReason() throws Exception {
    when(repository.findByNameIgnoreCaseAndActiveTrue("notebook"))
            .thenReturn(Optional.of(category(1L, "Notebook")));

    create("  notebook ")
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.status").value(409))
            .andExpect(jsonPath("$.detail", containsString("Notebook")));

    verify(repository, never()).save(any());
  }

  @Test
  void renamingToTheNameOfAnotherActiveCategoryAnswersConflict() throws Exception {
    Category desktop = category(2L, "Desktop");
    when(repository.findById(2L)).thenReturn(Optional.of(desktop));
    when(repository.findByNameIgnoreCaseAndActiveTrue("Notebook"))
            .thenReturn(Optional.of(category(1L, "Notebook")));

    rename(2L, "Notebook").andExpect(status().isConflict());

    assertThat(desktop.getName()).isEqualTo("Desktop");
  }

  @Test
  void savingACategoryWithItsOwnNameIsNotAConflict() throws Exception {
    Category notebook = category(1L, "Notebook");
    when(repository.findById(1L)).thenReturn(Optional.of(notebook));
    when(repository.findByNameIgnoreCaseAndActiveTrue("NOTEBOOK")).thenReturn(Optional.of(notebook));

    rename(1L, "NOTEBOOK")
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("NOTEBOOK"));
  }

}
