package br.ufpr.tads.manutencao.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "customers")
@DiscriminatorValue("CUSTOMER")
@PrimaryKeyJoinColumn(name = "user_id")
@Getter
@Setter
public class Customer extends User {

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(nullable = false, length = 11)
    private String phone;

  @Entity
  @Getter
  @Setter
  public static class Category {

      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;

      @Column(nullable = false, length = 60)
      private String name;

      @Column(nullable = false)
      private boolean active = true;
  }
}
