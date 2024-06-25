import { Pipe, PipeTransform } from '@angular/core';

// Função para converter números em texto
function numberToText(value: number): string {
  const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const hundreds = ['', 'cem', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  if (value === 0) return 'zero';
  if (value < 0) return `menos ${numberToText(-value)}`;

  let result = '';

  const getHundreds = (num: number) => {
    if (num > 100 && num < 200) return `cento`;
    return hundreds[Math.floor(num / 100)];
  };

  const getTens = (num: number) => {
    if (num >= 10 && num < 20) return teens[num - 10];
    return tens[Math.floor(num / 10)];
  };

  const getUnits = (num: number) => units[num % 10];

  if (value >= 100) {
    result += getHundreds(value) + (value % 100 !== 0 && value > 100 ? ' e ': ' ');
    value %= 100;
  }

  if (value >= 10) {
    result += getTens(value) + (value % 10 !== 0 && value > 20 ? ' e ' : '');

    if(value <= 20) {
      value = 0
    } else {
      value %= 10;
    }
  }

  if (value > 0) {
    result += getUnits(value) + ' ';
  }

  return result.trim();
}

// Função principal que converte valor monetário em texto
function currencyToText(value: number): string {
  const thousands = Math.floor(value / 1_000);
  value %= 1_000;

  const dias = Math.floor(value);

  let result = '';

  if (thousands > 0) {
    if (result) result += ' e ';
    result += `${numberToText(thousands)} mil`;
  }

  if (dias > 0) {
    if (result) result += ' e ';
    result += `${numberToText(dias)}`;
  }

  return result.trim();
}

@Pipe({
  name: 'numberToText',
  standalone: true
})
export class NumberToTextPipe implements PipeTransform {
  transform(value: number): string {
    return currencyToText(value);
  }
}
