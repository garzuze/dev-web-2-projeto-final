import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Request } from '../models/request';

@Component({
  selector: 'app-quote',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quote.html',
})
export class QuoteComponent implements OnInit {
  requestMock!: Request;

  ngOnInit() {
    // Static request data for testing
    this.requestMock = {
      id: 1,
      customerId: 10,
      equipmentDescription: 'Notebook Dell XPS 13',
      equipmentCategory: 'Notebook',
      defectDescription: 'Tela trincada após queda. Liga, mas não dá vídeo.',
      creationDateTime: new Date('2026-08-18T10:00:00'),
      currentStatus: 'ORÇADA',
      quoteAmount: 1250.0,
      history: [
        {
          dateTime: new Date('2026-08-18T10:00:00'),
          newStatus: 'ABERTA',
        },
        {
          dateTime: new Date('2026-08-19T14:30:00'),
          previousStatus: 'ABERTA',
          newStatus: 'ORÇADA',
          sourceEmployeeId: 1,
        },
      ],
    };
  }

  approveService() {
    alert(`Serviço Aprovado no Valor de R$ ${this.requestMock.quoteAmount?.toFixed(2)}`);
  }

  rejectService() {
    alert('Redirecionando para a tela de justificativa de rejeição...');
  }
}
