import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Autocadastro } from './autocadastro';

describe('Autocadastro', () => {
  let component: Autocadastro;
  let fixture: ComponentFixture<Autocadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Autocadastro],
    }).compileComponents();

    fixture = TestBed.createComponent(Autocadastro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
