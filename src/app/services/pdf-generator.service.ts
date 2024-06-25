import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  public progress$ = new Subject<number>();

  constructor() { }

  async generatePdf(contentIds: string[]): Promise<Blob> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();

    const totalItems = contentIds.length;
    for (const [index, contentId] of contentIds.entries()) {
      const element = document.getElementById(contentId);
      if (!element) {
        throw new Error(`Elemento com ID ${contentId} não encontrado`);
      }

      // Ajuste a escala para aumentar a qualidade
      const scale = 2;
      const canvas = await html2canvas(element, { scale });
      const imgData = canvas.toDataURL('image/jpeg', 0.75);
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pageWidth;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (index > 0) {
        pdf.addPage();
      }

      // Adicionar imagem como PNG
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      // Emitir progresso
      this.progress$.next(Math.round(((index + 1) / totalItems) * 100));
    }

    return pdf.output('blob');
  }
}
