import { Component, inject, signal } from '@angular/core';
import { ReportService, RevenueReport } from '../../../core/report.service';
import { EmployeeHeaderComponent } from '../../../components/employee-header/employee-header.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    imports: [
        EmployeeHeaderComponent, FormsModule, CommonModule
    ],
    selector: 'app-reports',
    templateUrl: './reports.component.html',
})
export class ReportsComponent {
    private readonly reportService = inject(ReportService)

    readonly revenueReport = signal<RevenueReport | null>(null);
    readonly loading = signal(false);
    readonly errorMessage = signal('');

    start: string = '';
    end: string = '';


    onGenerate() {
        this.loading.set(true);
        this.errorMessage.set('');

        this.reportService.revenueByDay(this.start || null, this.end || null).subscribe({
            next: (report) => {
                this.revenueReport.set(null);
                this.loading.set(false);
            },
            error: () => {
                this.revenueReport.set(null);
                this.errorMessage.set('Não foi possível gerar o relatório.');
                this.loading.set(false);
            },
        });
    }

}
