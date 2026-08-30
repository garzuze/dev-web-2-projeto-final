package br.ufpr.tads.manutencao.category;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Sem unique=true: a unicidade é parcial (só entre as ativas) e vive no
    // índice uk_category_name_active, que o JPA não sabe declarar.
    @Column(nullable = false, length = 60)
    private String name;

    @Column(nullable = false)
    private boolean active = true;
}
