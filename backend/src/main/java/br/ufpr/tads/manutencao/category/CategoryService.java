package br.ufpr.tads.manutencao.category;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.ufpr.tads.manutencao.category.dto.CategoryRequest;
import br.ufpr.tads.manutencao.category.dto.CategoryResponse;
import jakarta.persistence.EntityNotFoundException;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> list() {
        return categoryRepository.findByActiveTrueOrderByNameAsc()
                .stream()
                .map(CategoryResponse::of)
                .toList();
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        Category category = new Category();
        category.setName(requireAvailableName(request.name(), null));
        return CategoryResponse.of(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = activeById(id);
        category.setName(requireAvailableName(request.name(), id));
        return CategoryResponse.of(category);
    }

    @Transactional
    public void deactivate(Long id) {
        activeById(id).setActive(false);
    }

    private Category activeById(Long id) {
        return categoryRepository.findById(id)
                .filter(Category::isActive)
                .orElseThrow(() -> new EntityNotFoundException("Categoria " + id + " não encontrada"));
    }

    private String requireAvailableName(String name, Long currentId) {
        String normalized = name.trim();

        categoryRepository.findByNameIgnoreCaseAndActiveTrue(normalized)
                .filter(existing -> !existing.getId().equals(currentId))
                .ifPresent(existing -> {
                    throw new IllegalStateException(
                            "Já existe uma categoria ativa com o nome \"" + existing.getName()
                            + "\". Escolha outro nome ou edite a categoria existente."
                    );
                });

        return normalized;
    }

}
