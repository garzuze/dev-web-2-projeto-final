package br.ufpr.tads.manutencao.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
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

}
