import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { API_URL } from '../../../core/api';
import { HomeEmployeeComponent } from './home-employee.component';

describe('HomeEmployeeComponent', () => {
  let component: HomeEmployeeComponent;
  let fixture: ComponentFixture<HomeEmployeeComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeEmployeeComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeEmployeeComponent);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create', () => {
    httpTesting.expectOne(`${API_URL}/employee/requests/open`).flush([]);
    expect(component).toBeTruthy();
  });

  it('should list the open requests from the API', async () => {
    httpTesting.expectOne(`${API_URL}/employee/requests/open`).flush([
      {
        id: 4,
        openingDateTime: '2026-10-13T14:32:00',
        statusName: 'ABERTA',
        clientId: 25,
        clientName: 'José Pereira',
        categoryName: 'Desktop',
        equipmentDescription: 'Desktop Positivo Master D580',
        defectDescription: 'Reinicia sozinho',
        history: [],
      },
    ]);
    await fixture.whenStable();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('José Pereira');
    expect(text).toContain('Efetuar Orçamento');
  });

  it('should show the empty state when there are no open requests', async () => {
    httpTesting.expectOne(`${API_URL}/employee/requests/open`).flush([]);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Tudo em dia!');
  });
});
