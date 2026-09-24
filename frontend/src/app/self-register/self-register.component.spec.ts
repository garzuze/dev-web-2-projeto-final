import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelfRegister } from './self-register.component';

describe('SelfRegister', () => {
  let component: SelfRegister;
  let fixture: ComponentFixture<SelfRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfRegister],
    }).compileComponents();

    fixture = TestBed.createComponent(SelfRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
