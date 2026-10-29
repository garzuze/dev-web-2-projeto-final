package br.ufpr.tads.manutencao.category.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "category")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Category {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 60)
  private String name;

  // Soft delete
  @Column(nullable = false)
  @Builder.Default
  private boolean active = true;

}
