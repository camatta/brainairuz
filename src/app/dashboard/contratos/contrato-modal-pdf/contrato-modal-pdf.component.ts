import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contrato-modal-pdf',
  templateUrl: './contrato-modal-pdf.component.html',
  styleUrls: ['./contrato-modal-pdf.component.css'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class ContratoModalpdfComponent {
  @Input() contractCreated: boolean;
  @Input() contractUpdated: boolean;
  @Input() isContractReadyToView: boolean;

  @Input() pdfUrl: string;

  constructor(private router: Router) {}

  async downloadPdf(): Promise<void> {
    if (this.pdfUrl) {
      const link = document.createElement('a');
      link.href = this.pdfUrl;
      link.download = 'contrato.pdf';
      link.click();
    }
  }

  async openPdfInNewTab(): Promise<void> {
    if (this.pdfUrl) {
      window.open(this.pdfUrl, '_blank');
    }
  }

  closeModal() {
    if(this.contractUpdated) {
      this.router.navigate(['/dashboard/contratos/criar'])
    }
    this.contractCreated = false;
    this.isContractReadyToView = false;
  }
}
