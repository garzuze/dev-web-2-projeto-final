package br.ufpr.tads.manutencao.service;

import java.util.List;

import br.ufpr.tads.manutencao.dto.LoginResponse;
import br.ufpr.tads.manutencao.model.Customer;
import br.ufpr.tads.manutencao.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.ufpr.tads.manutencao.dto.CategoryRequest;
import jakarta.persistence.EntityNotFoundException;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<LoginResponse.CategoryResponse> list() {
        return categoryRepository.findByActiveTrueOrderByNameAsc()
                .stream()
                .map(LoginResponse.CategoryResponse::of)
                .toList();
    }

    @Transactional
    public LoginResponse.CategoryResponse create(CategoryRequest request) {
        Customer.Category category = new Customer.Category();
        category.setName(requireAvailableName(request.name(), null));
        return LoginResponse.CategoryResponse.of(categoryRepository.save(category));
    }

    @Transactional
    public LoginResponse.CategoryResponse update(Long id, CategoryRequest request) {
        Customer.Category category = activeById(id);
        category.setName(requireAvailableName(request.name(), id));
        return LoginResponse.CategoryResponse.of(category);
    }

    @Transactional
    public void deactivate(Long id) {
        activeById(id).setActive(false);
    }

    private Customer.Category activeById(Long id) {
        return categoryRepository.findById(id)
                .filter(Customer.Category::isActive)
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
