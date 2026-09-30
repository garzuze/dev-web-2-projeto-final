package br.ufpr.tads.manutencao.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "maintenance_request")
@Getter
@Setter
public class MaintenanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RequestStatus status;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "employee_id", nullable = true)
    private Employee employee;

    @Column(name = "equipment_description", nullable = false, length = 200)
    private String equipmentDescription;

    @Column(name = "defect_description", nullable = false, columnDefinition = "TEXT")
    private String defectDescription;

    @Column(name = "opening_date_time", nullable = false)
    private LocalDateTime openingDateTime;

    @Column(name = "quote_value", precision = 10, scale = 2)
    private BigDecimal quoteValue;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "maintenance_description", columnDefinition = "TEXT")
    private String maintenanceDescription;

    @Column(name = "client_instructions", columnDefinition = "TEXT")
    private String clientInstructions;

    @Column(name = "payment_date_time")
    private LocalDateTime paymentDateTime;

    @Column(name = "completion_date_time")
    private LocalDateTime completionDateTime;

    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RequestHistory> history = new ArrayList<>();
}
