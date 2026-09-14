import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaintenanceRequestService } from '../../../services/maintenance-request.service';
import { MaintenanceRequest } from '../../../models/maintenanceRequest.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-employee.component.html',
  styleUrl: './home-employee.component.scss',
})
export class HomeEmployeeComponent implements OnInit {
  private maintenanceRequestService = inject(MaintenanceRequestService);
  private router = inject(Router);

  public openRequests: MaintenanceRequest[] = [];

  ngOnInit(): void {
    this.maintenanceRequestService.getOpenRequests().subscribe({
      next: (requests) => {
        if (requests) {
          this.openRequests = requests;
        }
      },
    });
  }

  goToQuote(id: number): void {
    this.router.navigate(['/employee/quote', id]);
  }
}
