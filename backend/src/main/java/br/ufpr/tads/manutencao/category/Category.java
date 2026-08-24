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

    @Column(nullable = false, unique = true, length = 60)
    private String name;

    // soft delete: categoria desativada some das listagens, mas o historico
    // das solicitacoes que ja a usaram continua intacto (card S6-P6)
    @Column(nullable = false)
    private boolean active = true;
}
