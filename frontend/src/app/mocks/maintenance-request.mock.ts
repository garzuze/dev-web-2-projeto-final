import { MaintenanceRequest, RequestStatus } from '../models/maintenanceRequest.model';

export const MAINTENANCE_REQUEST_MOCK: MaintenanceRequest[] = [
  {
    id: 1,
    openingDateTime: '2026-08-25T09:30:00',
    statusName: RequestStatus.Open,

    clientId: 101,
    clientName: 'Vitor Felipe',

    categoryName: 'Notebook',
    equipmentDescription: 'Notebook Lenovo Ideapad 3',
    defectDescription: 'Notebook não liga',

    history: [
      {
        id: 1,
        requestId: 1,
        dateTime: '2026-08-25T09:30:00',
        newStatus: RequestStatus.Open,
        notes: 'Solicitação aberta pelo cliente.',
      },
    ],
  },

  {
    id: 2,
    openingDateTime: '2026-08-24T14:15:00',
    statusName: RequestStatus.Quoted,

    clientId: 102,
    clientName: 'Renan Groh',

    categoryName: 'Celulares',
    equipmentDescription: 'Samsung A56',
    defectDescription: 'Tela quebrada e touch apresentando falhas',

    quoteValue: 850.0,

    currentEmployeeName: 'Pedro Deyrot',

    history: [
      {
        id: 2,
        requestId: 2,
        dateTime: '2026-08-24T14:15:00',
        newStatus: RequestStatus.Open,
        notes: 'Solicitação aberta pelo cliente.',
      },
      {
        id: 3,
        requestId: 2,
        dateTime: '2026-08-25T10:20:00',
        previousStatus: RequestStatus.Open,
        newStatus: RequestStatus.Quoted,
        employeeName: 'Pedro Deyrot',
        notes: 'Orçamento elaborado para troca da tela.',
      },
    ],
  },

  {
    id: 3,
    openingDateTime: '2026-08-23T11:00:00',
    statusName: RequestStatus.Rejected,

    clientId: 103,
    clientName: 'Lucas Garzuze',

    categoryName: 'Notebook',
    equipmentDescription: 'Notebook Dell G15',
    defectDescription: 'Teclado e TouchPad não estão funcionando.',

    quoteValue: 920.0,
    rejectionReason: 'Orçamento Ofertado Muito Caro',

    history: [
      {
        id: 4,
        requestId: 3,
        dateTime: '2026-08-23T11:00:00',
        newStatus: RequestStatus.Open,
        notes: 'Solicitação aberta pelo cliente.',
      },
      {
        id: 5,
        requestId: 3,
        dateTime: '2026-08-24T15:30:00',
        previousStatus: RequestStatus.Open,
        newStatus: RequestStatus.Quoted,
        employeeName: 'Kim Kataguiri',
        notes: 'Orçamento elaborado.',
      },
      {
        id: 6,
        requestId: 3,
        dateTime: '2026-08-25T09:10:00',
        previousStatus: RequestStatus.Quoted,
        newStatus: RequestStatus.Rejected,
        notes: 'Cliente não aprovou o orçamento.',
      },
    ],
  },

  {
    id: 4,
    openingDateTime: '2026-08-22T08:45:00',
    statusName: RequestStatus.Approved,

    clientId: 104,
    clientName: 'Gabriel Alburquerque',

    categoryName: 'Computadores',
    equipmentDescription: 'Computador Desktop',
    defectDescription: 'Computador desligando sozinho',

    quoteValue: 450.0,

    currentEmployeeName: 'Nikolas Ferreira',

    history: [
      {
        id: 7,
        requestId: 4,
        dateTime: '2026-08-22T08:45:00',
        newStatus: RequestStatus.Open,
        notes: 'Solicitação aberta pelo cliente.',
      },
      {
        id: 8,
        requestId: 4,
        dateTime: '2026-08-23T13:00:00',
        previousStatus: RequestStatus.Open,
        newStatus: RequestStatus.Quoted,
        employeeName: 'Amanda Vetorazzo',
        notes: 'Orçamento enviado ao cliente.',
      },
      {
        id: 9,
        requestId: 4,
        dateTime: '2026-08-23T18:20:00',
        previousStatus: RequestStatus.Quoted,
        newStatus: RequestStatus.Approved,
        notes: 'Orçamento aprovado pelo cliente.',
      },
    ],
  },

  {
    id: 5,
    openingDateTime: '2026-08-20T10:30:00',
    statusName: RequestStatus.Redirected,

    clientId: 105,
    clientName: 'Yohan Cys',

    categoryName: 'Televisões',
    equipmentDescription: 'Televisão Samsung 55"',
    defectDescription: 'Televisão não apresenta imagem',

    quoteValue: 780.0,

    currentEmployeeName: 'Amanda Vetorazzo',

    history: [
      {
        id: 10,
        requestId: 5,
        dateTime: '2026-08-20T10:30:00',
        newStatus: RequestStatus.Open,
        notes: 'Solicitação aberta pelo cliente.',
      },
      {
        id: 11,
        requestId: 5,
        dateTime: '2026-08-21T09:00:00',
        previousStatus: RequestStatus.Open,
        newStatus: RequestStatus.Quoted,
        employeeName: 'Deltan Dallagnol',
        notes: 'Orçamento realizado.',
      },
      {
        id: 12,
        requestId: 5,
        dateTime: '2026-08-21T16:30:00',
        previousStatus: RequestStatus.Quoted,
        newStatus: RequestStatus.Approved,
        notes: 'Cliente aprovou o orçamento.',
      },
      {
        id: 13,
        requestId: 5,
        dateTime: '2026-08-22T08:15:00',
        previousStatus: RequestStatus.Approved,
        newStatus: RequestStatus.Redirected,
        employeeName: 'Deltan Dallagnol',
        destinationEmployeeName: 'Amanda Vetorazzo',
        notes: 'Manutenção redirecionada para outro funcionário.',
      },
    ],
  },

  {
    id: 6,
    openingDateTime: '2026-08-18T13:20:00',
    statusName: RequestStatus.Arranged,

    clientId: 106,
    clientName: 'Thiago Santos',

    categoryName: 'Celulares',
    equipmentDescription: 'Samsung Galaxy S22',
    defectDescription: 'Bateria descarregando rapidamente',

    quoteValue: 320.0,

    maintenanceDateTime: '2026-08-21T14:00:00',
    maintenanceEmployeeName: 'Ratinho Junior',
    maintenanceDescription: 'Substituição da bateria e testes de funcionamento.',
    clientInstructions: 'Evitar utilizar carregadores não originais.',

    history: [
      {
        id: 14,
        requestId: 6,
        dateTime: '2026-08-18T13:20:00',
        newStatus: RequestStatus.Open,
      },
      {
        id: 15,
        requestId: 6,
        dateTime: '2026-08-19T10:00:00',
        previousStatus: RequestStatus.Open,
        newStatus: RequestStatus.Quoted,
        employeeName: 'Ratinho Junior',
      },
      {
        id: 16,
        requestId: 6,
        dateTime: '2026-08-19T17:00:00',
        previousStatus: RequestStatus.Quoted,
        newStatus: RequestStatus.Approved,
        notes: 'Orçamento aprovado.',
      },
      {
        id: 17,
        requestId: 6,
        dateTime: '2026-08-21T16:30:00',
        previousStatus: RequestStatus.Approved,
        newStatus: RequestStatus.Arranged,
        employeeName: 'Ratinho Junior',
        notes: 'Equipamento reparado.',
      },
    ],
  },

  {
    id: 7,
    openingDateTime: '2026-08-15T09:10:00',
    statusName: RequestStatus.Paid,

    clientId: 107,
    clientName: 'Matheus Felipe',

    categoryName: 'Notebook',
    equipmentDescription: 'MacBook Air M2',
    defectDescription: 'Problema no teclado',

    quoteValue: 950.0,

    maintenanceDateTime: '2026-08-18T15:00:00',
    maintenanceEmployeeName: 'Juliana Brizola',
    maintenanceDescription: 'Substituição do teclado e testes realizados.',

    paymentDateTime: '2026-08-19T10:45:00',

    history: [
      {
        id: 18,
        requestId: 7,
        dateTime: '2026-08-15T09:10:00',
        newStatus: RequestStatus.Open,
      },
      {
        id: 19,
        requestId: 7,
        dateTime: '2026-08-16T11:00:00',
        previousStatus: RequestStatus.Open,
        newStatus: RequestStatus.Quoted,
        employeeName: 'Juliana Brizola',
      },
      {
        id: 20,
        requestId: 7,
        dateTime: '2026-08-16T18:00:00',
        previousStatus: RequestStatus.Quoted,
        newStatus: RequestStatus.Approved,
      },
      {
        id: 21,
        requestId: 7,
        dateTime: '2026-08-18T17:00:00',
        previousStatus: RequestStatus.Approved,
        newStatus: RequestStatus.Arranged,
        employeeName: 'Juliana Brizola',
      },
      {
        id: 22,
        requestId: 7,
        dateTime: '2026-08-19T10:45:00',
        previousStatus: RequestStatus.Arranged,
        newStatus: RequestStatus.Paid,
        notes: 'Pagamento realizado pelo cliente.',
      },
    ],
  },

  {
    id: 8,
    openingDateTime: '2026-08-10T08:30:00',
    statusName: RequestStatus.Completed,

    clientId: 108,
    clientName: 'Catia Regina',

    categoryName: 'Celulares',
    equipmentDescription: 'iPhone 16',
    defectDescription: 'Câmera danificada',

    quoteValue: 880.0,

    maintenanceDateTime: '2026-08-13T09:00:00',
    maintenanceEmployeeName: 'Tarcisio Freitas',
    maintenanceDescription:
      'Substituição do módulo da câmera traseira e realização de testes de funcionamento.',
    clientInstructions: 'Evitar contato do aparelho com água e utilizar capa protetora.',

    paymentDateTime: '2026-08-13T16:00:00',
    completionDateTime: '2026-08-13T16:30:00',
    completionEmployeeName: 'Tarcisio Freitas',

    history: [
      {
        id: 23,
        requestId: 8,
        dateTime: '2026-08-10T08:30:00',
        newStatus: RequestStatus.Open,
        notes: 'Solicitação aberta pelo cliente.',
      },
      {
        id: 24,
        requestId: 8,
        dateTime: '2026-08-10T15:00:00',
        previousStatus: RequestStatus.Open,
        newStatus: RequestStatus.Quoted,
        employeeName: 'Tarcisio Freitas',
        notes: 'Orçamento elaborado para substituição da câmera.',
      },
      {
        id: 25,
        requestId: 8,
        dateTime: '2026-08-11T09:30:00',
        previousStatus: RequestStatus.Quoted,
        newStatus: RequestStatus.Approved,
        notes: 'Orçamento aprovado pelo cliente.',
      },
      {
        id: 26,
        requestId: 8,
        dateTime: '2026-08-13T14:30:00',
        previousStatus: RequestStatus.Approved,
        newStatus: RequestStatus.Arranged,
        employeeName: 'Tarcisio Freitas',
        notes: 'Câmera substituída e aparelho testado com sucesso.',
      },
      {
        id: 27,
        requestId: 8,
        dateTime: '2026-08-13T16:00:00',
        previousStatus: RequestStatus.Arranged,
        newStatus: RequestStatus.Paid,
        notes: 'Pagamento confirmado.',
      },
      {
        id: 28,
        requestId: 8,
        dateTime: '2026-08-13T16:30:00',
        previousStatus: RequestStatus.Paid,
        newStatus: RequestStatus.Completed,
        employeeName: 'Tarcisio Freitas',
        notes: 'Solicitação finalizada e equipamento entregue ao cliente.',
      },
    ],
  },
];
