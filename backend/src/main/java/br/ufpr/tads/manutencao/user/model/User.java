package br.ufpr.tads.manutencao.user.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "type", length = 15)
// NOTA: acho que deveríamos rever usar esses decorators do lombok de forma geral em toda a classe,
// pois isso pode quebrar o encapsulamento, já que estamos deixando coisas como senha e salt com set
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// https://stackoverflow.com/questions/44948858/lombok-builder-on-a-class-that-extends-another-class
@SuperBuilder
public abstract class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 120)
  private String name;

  @Column(nullable = false, unique = true, length = 150)
  private String email;

  @Column(nullable = false, length = 44)
  private String passwordHash;

  @Column(nullable = false, length = 24)
  private String salt;

  @Column(nullable = false)
  private boolean active = true;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

}
