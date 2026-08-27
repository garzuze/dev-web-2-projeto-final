import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitacao-servico-cliente',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitacao-servico-cliente.html',
})
export class SolicitacaoServicoCliente implements OnInit {

  manutencaoForm!: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.manutencaoForm = this.fb.group({
      tipo: ['', Validators.required],
      modelo: ['', Validators.required],
      descricao: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.manutencaoForm.valid) {
      console.log('Dados da solicitação:', this.manutencaoForm.value);
    } else {
      this.manutencaoForm.markAllAsTouched();
    }
  }
}
