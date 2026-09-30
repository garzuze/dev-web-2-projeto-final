package br.ufpr.tads.manutencao.service;

import br.ufpr.tads.manutencao.dto.RevenueReport;
import br.ufpr.tads.manutencao.repository.MaintenanceRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class ReportService {

    private final MaintenanceRequestRepository requestRepository;


    public ReportService(MaintenanceRequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    @Transactional(readOnly = true)
    public RevenueReport revenueByDay(LocalDate start, LocalDate end) {

        return null;
    }

}
