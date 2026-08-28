import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Request } from '../models/request';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './payment.html',
})
export class PaymentComponent implements OnInit {
  requestMock!: Request;
  paymentMethod: string = 'PIX';
  isProcessing = false;
  paymentSuccess = false;
  feedbackMessage: string | null = null;

  ngOnInit() {
    this.initMockData();
  }

  initMockData() {
    this.requestMock = {
      id: 1,
      customerId: 10,
      equipmentDescription: 'Notebook Dell XPS 13',
      equipmentCategory: 'Notebook',
      defectDescription: 'Tela trincada após queda acidental.',
      creationDateTime: new Date('2026-08-18T10:00:00'),
      currentStatus: 'ARRUMADA',
      quoteAmount: 1250.0,
      maintenanceDescription: 'Substituição do display FHD original e troca da pasta térmica.',
      customerInstructions: 'Evitar pressionar a tampa durante o transporte e usar fonte de alimentação original.',
      maintenanceDateTime: new Date('2026-08-20T16:45:00'),
      maintenanceEmployeeId: 2,
      history: [
        {
          dateTime: new Date('2026-08-18T10:00:00'),
          newStatus: 'ABERTA',
        },
        {
          dateTime: new Date('2026-08-19T14:30:00'),
          previousStatus: 'ABERTA',
          newStatus: 'ORÇADA',
        },
        {
          dateTime: new Date('2026-08-19T16:00:00'),
          previousStatus: 'ORÇADA',
          newStatus: 'APROVADA',
        },
        {
          dateTime: new Date('2026-08-20T16:45:00'),
          previousStatus: 'APROVADA',
          newStatus: 'ARRUMADA',
          sourceEmployeeId: 2,
          notes: 'Manutenção concluída pelo técnico',
        },
      ],
    };
  }

  // RF010 - Confirmar Pagamento do Pedido
  confirmPayment() {
    this.isProcessing = true;

    setTimeout(() => {
      const now = new Date();
      const previous = this.requestMock.currentStatus;

      this.requestMock.currentStatus = 'PAGA';
      this.requestMock.paymentDateTime = now;

      this.requestMock.history.push({
        dateTime: now,
        previousStatus: previous,
        newStatus: 'PAGA',
        notes: `Pagamento de R$ ${this.requestMock.quoteAmount?.toFixed(2)} confirmado via ${this.paymentMethod}`,
      });

      this.isProcessing = false;
      this.paymentSuccess = true;
      this.feedbackMessage = `Pagamento confirmado com sucesso em ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR')}! O equipamento está pronto para retirada.`;
    }, 400);
  }

  resetPayment() {
    this.paymentSuccess = false;
    this.requestMock.currentStatus = 'ARRUMADA';
    this.requestMock.paymentDateTime = undefined;
    this.feedbackMessage = null;
  }
}
