import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RescueModalComponent } from './rescue-modal.component';

describe('RescueModalComponent', () => {
  let component: RescueModalComponent;
  let fixture: ComponentFixture<RescueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RescueModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RescueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
