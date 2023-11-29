import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-icp',
  templateUrl: './icp.component.html',
  styleUrls: ['./icp.component.css']
})

export class IcpComponent {
  siteEmpresa: string = "";
  palavrasChave: string = "";
  linkGoogle: string = `https://www.google.com/trends/explore#cmpt=q&q=${this.palavrasChave}&geo=BR`;
  keyPlanner: string = "https://adwords.google.com/KeywordPlanner";
  perfilFuncionarios: string = "...";
  perfilFaturamento: string = "...";
  perfilPontoFocal: string = "...";
  perfilMktInterno: string = "...";
  perfilVisitacao: string = "...";
  checkSEO: string = "https://seositecheckup.com/";
  checkVisitacao: string = `http://www.browseo.net/?url=http%3A%2F%2F${this.siteEmpresa}`;
  checkAnuncios: string = `https://www.semrush.com/br/info/${this.siteEmpresa}/+(by+adwords)`;

  setNomeEmpresa(siteEmpresa: string) {
    this.siteEmpresa = siteEmpresa;
  }

  setPalavrasChave(palavrasChave: string) {
    this.palavrasChave = palavrasChave;
  }

  setPerfilEmpresaValores(valor: string) {
    switch (valor) {
      case "0": return "D";
      case "30": return "C";
      case "50": return "B";
      case "70B": return "B";
      case "70": return "A";
      case "100": return "Enterprise";
      default: return "...";
    }
  }

  setPerfilEmpresaSimNao(valor: string) {
    switch (valor) {
      case "0": return "C";
      case "100": return "Enterprise";
      default: return "...";
    }
  }

  setPerfilFuncionarios(funcionarios: string) {
    this.perfilFuncionarios = this.setPerfilEmpresaValores(funcionarios);
  }

  setPerfilFaturamento(faturamento: string) {
    this.perfilFaturamento = this.setPerfilEmpresaValores(faturamento);
  }

  setPerfilPontoFocal(pontoFocal: string) {
    this.perfilPontoFocal = this.setPerfilEmpresaSimNao(pontoFocal);
  }

  setPerfilMktInterno(mktInterno: string) {
    this.perfilMktInterno = this.setPerfilEmpresaSimNao(mktInterno);
  }

  setPerfilVisitacao(visitacao: string) {
    this.perfilVisitacao = this.setPerfilEmpresaValores(visitacao);
  }

  public formLink = new FormGroup({
    url: new FormControl('')
  });

  setPercentualdeFit() {
    
  }
}