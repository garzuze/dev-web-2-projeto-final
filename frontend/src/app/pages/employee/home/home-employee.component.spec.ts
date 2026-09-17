import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeEmployeeComponent } from './home-employee.component';

describe('HomeEmployeeComponent', () => {
  let component: HomeEmployeeComponent;
  let fixture: ComponentFixture<HomeEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeEmployeeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
