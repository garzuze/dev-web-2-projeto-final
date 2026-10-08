package br.ufpr.tads.manutencao.request.model;

import br.ufpr.tads.manutencao.category.model.Category;
import br.ufpr.tads.manutencao.user.model.Customer;
import br.ufpr.tads.manutencao.user.model.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
  @JoinColumn(name = "current_employee_id", nullable = true)
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

  @Column(name = "customer_instructions", columnDefinition = "TEXT")
  private String customerInstructions;

  @Column(name = "payment_date_time")
  private LocalDateTime paymentDateTime;


  @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<RequestHistory> history = new ArrayList<>();

  public void addHistory(RequestHistory h) {
    h.setRequest(this);
    history.add(h);
  }

}
