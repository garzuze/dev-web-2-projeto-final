package br.ufpr.tads.manutencao.dto;

import lombok.Data;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface DaillyRevenue {

    LocalDate getDay();

    BigDecimal getTotal();

}
