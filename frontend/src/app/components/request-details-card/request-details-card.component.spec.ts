import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestDetailsCardComponent } from './request-details-card.component';

describe('RequestDetailsCardComponent', () => {
  let component: RequestDetailsCardComponent;
  let fixture: ComponentFixture<RequestDetailsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestDetailsCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
