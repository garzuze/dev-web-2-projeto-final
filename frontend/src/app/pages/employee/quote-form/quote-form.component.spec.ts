import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  provideRouter,
  Router,
} from '@angular/router';
import { of } from 'rxjs';
import { API_URL } from '../../../core/api';
import {
  MaintenanceRequest,
  RequestStatus,
} from '../../../models/maintenanceRequest.model';
import { QuoteFormComponent } from './quote-form.component';

describe('QuoteFormComponent', () => {
  let component: QuoteFormComponent;
  let fixture: ComponentFixture<QuoteFormComponent>;
  let httpTesting: HttpTestingController;
  const request: MaintenanceRequest = {
    id: 5,
    openingDateTime: '2026-10-13T14:32:00',
    statusName: RequestStatus.Open,
    clientId: 25,
    clientName: 'José Pereira',
    categoryName: 'Desktop',
    equipmentDescription: 'Desktop Positivo Master D580',
    defectDescription: 'Reinicia sozinho',
    history: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteFormComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id: '5' })) },
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QuoteFormComponent);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create', () => {
    httpTesting.expectOne(`${API_URL}/employee/requests/5`).flush(request);
    expect(component).toBeTruthy();
  });

  it('should load the request from the API and render the equipment description', async () => {
    const getRequest = httpTesting.expectOne(`${API_URL}/employee/requests/5`);
    expect(getRequest.request.method).toBe('GET');
    getRequest.flush(request);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      request.equipmentDescription,
    );
  });

  it('should submit the quote value to the API', () => {
    httpTesting.expectOne(`${API_URL}/employee/requests/5`).flush(request);
    const navigate = vi
      .spyOn(TestBed.inject(Router), 'navigate')
      .mockResolvedValue(true);
    component.quoteForm.get('quoteValue')?.setValue(350);

    component.onSubmit();

    const quoteRequest = httpTesting.expectOne(
      `${API_URL}/employee/requests/5/quote`,
    );
    expect(quoteRequest.request.method).toBe('PUT');
    expect(quoteRequest.request.body).toEqual({ quoteValue: 350 });
    quoteRequest.flush({
      ...request,
      statusName: RequestStatus.Quoted,
      quoteValue: 350,
    });
    expect(navigate).toHaveBeenCalledWith(['/employee/home']);
  });
});
