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
  const billions = Math.floor(value / 1_000_000_000);
  value %= 1_000_000_000;

  const millions = Math.floor(value / 1_000_000);
  value %= 1_000_000;

  const thousands = Math.floor(value / 1_000);
  value %= 1_000;

  const reais = Math.floor(value);
  const centavos = Math.round((value - reais) * 100);

  let result = '';

  if (billions > 0) {
    result += `${numberToText(billions)} ${billions > 1 ? 'bilhões' : 'bilhão'}`;

    if(reais === 0 && thousands === 0 && millions === 0 ) {
      result += ' de reais'
    }
  }

  if (millions > 0) {
    if (result) result += ' e ';
    result += `${numberToText(millions)} ${millions > 1 ? 'milhões' : 'milhão'}`;

    if(reais === 0 && thousands === 0 ) {
      result += ' de reais'
    }
  }

  if (thousands > 0) {
    if (result) result += ' e ';
    result += `${numberToText(thousands)} mil`;
    if(reais === 0 ) {
      result += ' reais'
    }
  }

  if (reais > 0) {
    if (result) result += ' e ';
    result += `${numberToText(reais)} ${reais > 1 ? 'reais' : 'real'}`;
  }

  if (centavos > 0) {
    if (result) result += ' e ';
    result += `${numberToText(centavos)} ${centavos > 1 ? 'centavos' : 'centavo'}`;
  }

  return result.trim();
}

@Pipe({
  name: 'currencyToText',
  standalone: true
})
export class CurrencyToTextPipe implements PipeTransform {
  transform(value: number): string {
    return currencyToText(value);
  }
}
