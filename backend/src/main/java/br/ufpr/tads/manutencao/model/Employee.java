package br.ufpr.tads.manutencao.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "employees")
@DiscriminatorValue("EMPLOYEE")
@PrimaryKeyJoinColumn(name = "user_id")
@Getter
@Setter
public class Employee extends User {

  @Column(nullable = false)
  private LocalDate birthDate;

}
