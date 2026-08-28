package br.ufpr.tads.manutencao.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "addresses")
@Getter
@Setter
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false, unique = true)
    private Customer customer;

    @Column(nullable = false, length = 8)
    private String zipCode;

    @Column(nullable = false, length = 150)
    private String street;

    @Column(nullable = false, length = 10)
    private String number;

    @Column(length = 60)
    private String complement;

    @Column(nullable = false, length = 80)
    private String district;

    @Column(nullable = false, length = 80)
    private String city;

    @Column(nullable = false, length = 2)
    private String state;

}
