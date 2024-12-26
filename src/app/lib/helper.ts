import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class Helper {
    // Método que recebe um número como string e retorna o respectivo mês
    setMes(mes: string) {
        switch(mes) {
          case "01":
            return "Janeiro";
          case "02":
            return "Fevereiro";
          case "03":
            return "Março";
          case "04":
            return "Abril";
          case "05":
            return "Maio";
          case "06":
            return "Junho";
          case "07":
            return "Julho";
          case "08":
            return "Agosto";
          case "09":
            return "Setembro";
          case "10":
            return "Outubro";
          case "11":
            return "Novembro";
          case "12":
            return "Dezembro";
          default:
            return "Erro no mês enviado";
        }
    }

    setFormatarDataParaHtmlInput(data: Date | string) {
      if(data) {
        const dataSplit = String(data).split("-");
        const mes = Number(dataSplit[1]) - 1;
        const ano = Number(dataSplit[0]);
        const daySplit = dataSplit[2].split("T");
        const dia = Number(daySplit[0]);
        const hourSplit = daySplit[1].split(":");
        const hora = Number(hourSplit[0]) - 3;
        const minuto = Number(hourSplit[1]);
    
        const dataGerada = new Date(ano, mes, dia, hora, minuto);
        const dataFormatada = dataGerada.toISOString().slice(0, 16);
  
        return { dataFormatada, mes, ano, dia, hora, minuto };
      } 
      
      return null;
    }
}