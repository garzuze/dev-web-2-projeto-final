import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Request, RequestStatus } from '../models/request';

@Component({
  selector: 'app-quote',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './quote.html',
})
export class QuoteComponent implements OnInit {
  requestMock!: Request;
  isRejectModalOpen = false;
  rejectionReason = '';
  feedbackMessage: string | null = null;
  feedbackType: 'success' | 'error' | 'info' = 'success';

  ngOnInit() {
    this.initMockData();
  }

  initMockData() {
    this.requestMock = {
      id: 1,
      customerId: 10,
      equipmentDescription: 'Notebook Dell XPS 13',
      equipmentCategory: 'Notebook',
      defectDescription: 'Tela trincada após queda acidental. Equipamento liga os LEDs, mas não apresenta vídeo.',
      creationDateTime: new Date('2026-08-18T10:00:00'),
      currentStatus: 'ORÇADA',
      quoteAmount: 1250.0,
      history: [
        {
          dateTime: new Date('2026-08-18T10:00:00'),
          newStatus: 'ABERTA',
          notes: 'Solicitação registrada pelo cliente',
        },
        {
          dateTime: new Date('2026-08-19T14:30:00'),
          previousStatus: 'ABERTA',
          newStatus: 'ORÇADA',
          sourceEmployeeId: 1,
          notes: 'Orçamento de R$ 1.250,00 registrado pelo técnico',
        },
      ],
    };
  }

  // RF005 / RF006 - Aprovar Serviço
  approveService() {
    if (!this.requestMock.quoteAmount) return;

    const previous = this.requestMock.currentStatus;
    this.requestMock.currentStatus = 'APROVADA';
    this.requestMock.history.push({
      dateTime: new Date(),
      previousStatus: previous,
      newStatus: 'APROVADA',
      notes: `Serviço aprovado pelo cliente no valor de R$ ${this.requestMock.quoteAmount.toFixed(2)}`,
    });

    this.feedbackType = 'success';
    this.feedbackMessage = `Serviço Aprovado no Valor de R$ ${this.requestMock.quoteAmount.toFixed(2)}! A manutenção será iniciada em breve.`;
  }

  // Modal e Ação de Rejeição
  openRejectModal() {
    this.rejectionReason = '';
    this.isRejectModalOpen = true;
  }

  closeRejectModal() {
    this.isRejectModalOpen = false;
    this.rejectionReason = '';
  }

  confirmRejectService() {
    if (!this.rejectionReason.trim()) {
      alert('Por favor, informe o motivo da rejeição.');
      return;
    }

    const previous = this.requestMock.currentStatus;
    this.requestMock.currentStatus = 'REJEITADA';
    this.requestMock.rejectionReason = this.rejectionReason.trim();
    this.requestMock.history.push({
      dateTime: new Date(),
      previousStatus: previous,
      newStatus: 'REJEITADA',
      notes: `Rejeitado pelo cliente. Motivo: ${this.requestMock.rejectionReason}`,
    });

    this.isRejectModalOpen = false;
    this.feedbackType = 'info';
    this.feedbackMessage = 'Serviço Rejeitado. Você poderá resgatar a solicitação a qualquer momento.';
  }

  // Resgatar Serviço
  rescueService() {
    const previous = this.requestMock.currentStatus;
    this.requestMock.currentStatus = 'APROVADA';
    this.requestMock.history.push({
      dateTime: new Date(),
      previousStatus: previous,
      newStatus: 'APROVADA',
      notes: 'Solicitação resgatada pelo cliente (passou de REJEITADA para APROVADA).',
    });

    this.feedbackType = 'success';
    this.feedbackMessage = 'Serviço resgatado com sucesso! A solicitação retornou para o estado APROVADA.';
  }

  dismissFeedback() {
    this.feedbackMessage = null;
  }

  // Helper para simular outros status durante os testes
  setStatusForTesting(status: RequestStatus) {
    this.requestMock.currentStatus = status;
    this.feedbackMessage = null;
  }
}
