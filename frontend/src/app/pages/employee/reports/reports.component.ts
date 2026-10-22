import { Component, inject, signal } from '@angular/core';
import { ReportService, RevenueReport } from '../../../core/report.service';
import { EmployeeHeaderComponent } from '../../../components/employee-header/employee-header.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { CurrencyPipe, DatePipe } from '@angular/common';


@Component({
    imports: [
        EmployeeHeaderComponent, FormsModule, CommonModule
    ],
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    providers: [DatePipe, CurrencyPipe]
})
export class ReportsComponent {
    private readonly reportService = inject(ReportService)

    readonly revenueReport = signal<RevenueReport | null>(null);
    readonly loading = signal(false);
    readonly errorMessage = signal('');

    private readonly datePipe = inject(DatePipe);
    private readonly currencyPipe = inject(CurrencyPipe);

    start: string = '';
    end: string = '';


    onGenerate() {
        this.loading.set(true);
        this.errorMessage.set('');

        this.reportService.revenueByDay(this.start || null, this.end || null).subscribe({
            next: (report) => {
                this.revenueReport.set(report);
                this.loading.set(false);
            },
            error: () => {
                this.revenueReport.set(null);
                this.errorMessage.set('Não foi possível gerar o relatório.');
                this.loading.set(false);
            },
        });
    }

    onExportPdf(): void {
        const report = this.revenueReport();

        if (!report || report.days.length === 0) {
            return;
        }

        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Relatório de Receitas', 20, 20);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');

        const start = this.datePipe.transform(report.start, 'dd/MM/yyyy');
        const end = this.datePipe.transform(report.end, 'dd/MM/yyyy');

        doc.text(`Período: ${start} a ${end}`, 20, 30);

        const rows = report.days.map(day => [
            this.datePipe.transform(day.day, 'dd/MM/yyyy'),
            this.currencyPipe.transform(day.total, 'BRL')
        ]);

        autoTable(doc, {
            startY: 40,
            head: [['Data', 'Receita']],
            body: rows,
            foot: [['Total', this.currencyPipe.transform(report.total, 'BRL')]]
        });

        // salva com o nome: receitas-aaaa-mm-dd.pdf
        const today = new Date().toISOString().split('T')[0];

        doc.save(`receitas-${today}.pdf`);
    }

}
