package br.ufpr.tads.manutencao.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

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
