package br.ufpr.tads.manutencao.model;

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
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "request_history")
@Getter
@Setter
public class RequestHistory {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "request_id", nullable = false)
  private MaintenanceRequest request;

  @Enumerated(EnumType.STRING)
  @Column(name = "previous_status", length = 20)
  private RequestStatus previousStatus;

  @Enumerated(EnumType.STRING)
  @Column(name = "new_status", length = 20)
  private RequestStatus newStatus;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "author_id")
  private User author;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "destination_employee_id")
  private Employee destinationEmployee;

  @Column(name = "date_time", nullable = false)
  private LocalDateTime dateTime;

  @Column(name = "notes", columnDefinition = "TEXT")
  private String notes;
}