import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateMask',
  standalone: true
})
export class DateMaskPipe implements PipeTransform {
  transform(value: string): string {
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];

    const date = new Date(value);
    date.setDate(date.getDate() + 1);
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} de ${month} de ${year}`;
  }
}
