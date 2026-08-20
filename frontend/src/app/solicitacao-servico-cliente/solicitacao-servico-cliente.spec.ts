import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitacaoServicoCliente } from './solicitacao-servico-cliente';

describe('SolicitacaoServicoCliente', () => {
  let component: SolicitacaoServicoCliente;
  let fixture: ComponentFixture<SolicitacaoServicoCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitacaoServicoCliente],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitacaoServicoCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
