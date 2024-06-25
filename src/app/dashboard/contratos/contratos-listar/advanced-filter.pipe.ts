import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'advancedFilter',
  standalone: true
})
export class AdvancedFilterPipe implements PipeTransform {
  transform(items: any[], text: string, select1: string, select2: string): any[] {
    if (!items) return [];
    if (!text && !select1 && !select2) return items;

    text = text ? text.toLowerCase() : '';
    select1 = select1 ? select1.toLowerCase() : '';
    select2 = select2 ? select2.toLowerCase() : '';

    return items.filter(item => {
      const matchesText = text ? (item.extEmpresaGroup.extEmpresaNome && item.extEmpresaGroup.extEmpresaNome.toLowerCase().includes(text)) : true;
      const matchesSelect1 = select1 ? (item.contratoAutor && item.contratoAutor.toLowerCase() === select1) : true;
      const matchesSelect2 = select2 ? (item.contratoStatus && item.contratoStatus.toLowerCase() === select2) : true;

      return matchesText && matchesSelect1 && matchesSelect2;
    });
  }
}