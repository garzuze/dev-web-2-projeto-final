import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-solicitacao-servico-cliente',
  styleUrl: './solicitacao-servico-cliente.scss',
  templateUrl: './solicitacao-servico-cliente.html',
})
export class SolicitacaoServicoCliente {
  // Função que será disparada pelo clique no HTML
  enviarSolicitacao() {
    alert('Sua solicitação foi registrada no sistema!');
    // No futuro, aqui vai o código para enviar os dados ao Banco de Dados
  }
}
