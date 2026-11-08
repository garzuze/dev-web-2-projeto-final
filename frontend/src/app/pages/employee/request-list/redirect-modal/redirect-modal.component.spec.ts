import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RedirectModalComponent } from './redirect-modal.component';

describe('RedirectModalComponent', () => {
  let component: RedirectModalComponent;
  let fixture: ComponentFixture<RedirectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedirectModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RedirectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with selectedEmployeeId as null', () => {
    expect(component.selectedEmployeeId).toBeNull();
  });
});
