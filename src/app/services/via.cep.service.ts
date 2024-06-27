import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export type CEP = {
  cep: string;
  logradouro: string,
  complemento: string,
  unidade: string,
  bairro: string,
  localidade: string,
  uf: string,
  ibge: string,
  gia: string,
  ddd: string,
  siafi: string
}
       

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {
  constructor(private http: HttpClient) {}

  getCepInfo = (cep: string): Observable<CEP> => {
    return this.http.get<CEP>(`https://viacep.com.br/ws/${cep}/json/`);
  }

  getStateName(uf: string): string {
    switch (uf) {
      case "AC":
        return "Acre";

      case "AL":
        return "Alagoas";

      case "AP":
        return "Amapá";

      case "AM":
        return "Amazonas";

      case "BA":
        return "Bahia";

      case "CE":
        return "Ceará";
      case "DF":
        return "Distrito Federal";

      case "ES":
        return "Espírito Santo";

      case "GO":
        return "Goiás";

      case "MA":
        return "Maranhão";

      case "MT":
        return "Mato Grosso";

      case "MS":
        return "Mato Grosso do Sul";

      case "MG":
        return "Minas Gerais";

      case "PA":
        return "Pará";

      case "PB":
        return "Paraíba";

      case "PR":
        return "Paraná";

      case "PE":
        return "Pernambuco";

      case "PI":
        return "Piauí";

      case "RJ":
        return "Rio de Janeiro";

      case "RN":
        return "Rio Grande do Norte";

      case "RS":
        return "Rio Grande do Sul";

      case "RO":
        return "Rondônia";

      case "RR":
        return "Roraima";

      case "SC":
        return "Santa Catarina";

      case "SP":
        return "São Paulo";

      case "SE":
        return "Sergipe";

      case "TO":
        return "Tocantins";

      default:
        return "N/A";
    }
  }
}