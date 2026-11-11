import { Component, inject, signal } from '@angular/core';
import { ReportService, RevenueReport } from '../../../core/report.service';
import { EmployeeHeaderComponent } from '../../../components/employee-header/employee-header.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';


@Component({
    imports: [
        EmployeeHeaderComponent, FormsModule, CommonModule
    ],
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    providers: [DatePipe, CurrencyPipe, PercentPipe]
})
export class ReportsComponent {
    private readonly reportService = inject(ReportService)

    readonly revenueReport = signal<RevenueReport | null>(null);
    readonly loading = signal(false);
    readonly errorMessage = signal('');

    private readonly datePipe = inject(DatePipe);
    private readonly currencyPipe = inject(CurrencyPipe);
    private readonly percentPipe = inject(PercentPipe);

    start: string = '';
    end: string = '';


    onGenerate() {
        if (this.start && this.end && this.start > this.end) {
            this.revenueReport.set(null);
            this.errorMessage.set('A data inicial não pode ser posterior à data final.');
            return;
        }
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

    onExportCategoryPdf(): void {
        this.loading.set(true);
        this.errorMessage.set('');

        this.reportService.revenueByCategory().subscribe({
            next: (report) => {
                this.loading.set(false);

                if (report.categories.length === 0) {
                    this.errorMessage.set('Nenhuma receita registrada.');
                    return;
                }

                const doc = new jsPDF();

                doc.setFontSize(18);
                doc.setFont('helvetica', 'bold');
                doc.text('Receitas por Categoria', 20, 20);

                const rows = report.categories.map(c => [
                    c.name,
                    this.currencyPipe.transform(c.total, 'BRL') ?? '',
                    this.percentPipe.transform(report.total > 0 ? c.total / report.total : 0, '1.1-1') ?? '',
                ]);

                autoTable(doc, {
                    startY: 30,
                    head: [['Categoria', 'Receita', '%']],
                    body: rows,
                    foot: [['Total', this.currencyPipe.transform(report.total, 'BRL') ?? '', this.percentPipe.transform(1, '1.1-1') ?? '']],
                });

                doc.save(`receitas-por-categoria-${new Date().toISOString().slice(0, 10)}.pdf`);
            },
            error: () => {
                this.errorMessage.set('Não foi possível gerar o relatório.');
                this.loading.set(false);
            },
        });
    }



}
