package br.ufpr.tads.manutencao.user.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "customers")
@DiscriminatorValue("CUSTOMER")
@PrimaryKeyJoinColumn(name = "user_id")
@Getter
@Setter
// https://stackoverflow.com/questions/44948858/lombok-builder-on-a-class-that-extends-another-class
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Customer extends User {

  @Column(nullable = false, unique = true, length = 11)
  private String cpf;

  @Column(nullable = false, length = 11)
  private String phone;
}
