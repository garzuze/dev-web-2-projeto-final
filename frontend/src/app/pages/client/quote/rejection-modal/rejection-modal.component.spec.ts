import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RejectionModalComponent } from './rejection-modal.component';

describe('RejectionModalComponent', () => {
  let component: RejectionModalComponent;
  let fixture: ComponentFixture<RejectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RejectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
