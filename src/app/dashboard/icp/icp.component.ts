import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';

interface Valores {
  [key: string]: string;
}



@Component({
  selector: 'app-icp',
  templateUrl: './icp.component.html',
  styleUrls: ['./icp.component.css']
})

export class IcpComponent {
  siteEmpresaInput: boolean = false;
  palavrasChaveInput: boolean = false;
  linkGoogle: string = "";
  keyPlanner: string = "https://adwords.google.com/KeywordPlanner";
  perfilFuncionarios: string = "...";
  perfilFaturamento: string = "...";
  perfilPontoFocal: string = "...";
  perfilMktInterno: string = "...";
  perfilVisitacao: string = "...";
  checkSEO: string = "https://seositecheckup.com/";
  checkVisitacao: string = "";
  checkAnuncios: string = "";

  setNomeEmpresa(siteEmpresa: string) {
    this.siteEmpresaInput = true;
    this.checkVisitacao = `http://www.browseo.net/?url=http%3A%2F%2F${siteEmpresa}`;
    this.checkAnuncios = `https://www.semrush.com/br/info/${siteEmpresa}/+(by+adwords)`;
  }

  setPalavrasChave(palavrasChave: string) {
    this.palavrasChaveInput = true;
    this.linkGoogle = `https://www.google.com/trends/explore#cmpt=q&q=${palavrasChave}&geo=BR`;
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

  valores: Valores = {
    segmentoWeb: "",
    volumePesquisa: "",
    modeloNegocio: "",
    processoCompra: "",
    ticketMedio: "",
    capacidadeInvestimento: "",
    estrategiaDiretor: "",
    cargoContato: "",
    areaAtuacao: "",
    atendeSegmentoAtuacao: "",
    qtdFuncionarios: "",
    faturamentoMensal: "",
    utilizaCRM: "",
    tamanhoBaseContatos: "",
    qtdVendedores: "",
    enderecoWeb: "",
    mantemBlog: "",
    trabalhouComAgencia: "",
    pontoFocal: "",
    timeInternoMkt: "",
    interacaoRedesSociais: "",
    geracaoLeads: "",
    usaAnalytics: "",
    basicoSEO: "",
    boaVisitacaoSite: "",
    investeAnuncios: "",
    metaFaturamento: ""
  }

  fit: string = "";
  fitMessage: string = "";
  err: string = "";

  setPercentualdeFit(valores: any): string {
    var total = 0;
    this.err = "";
    this.fit = "";
    
    Object.keys(valores).forEach((item) => {

      if(valores[item] != "informativo"){
        if(valores[item] != ""){
          valores[item] == "70B" ? total += 70 : total += Number(valores[item]);
        } else {
          this.err = "Resultado inválido! Preencha TODOS os campos para gerar o Fit.";
        }
      }
    })

    if(this.err == "" && total != 0){
      var resultado = Number((total / 1880 * 100).toFixed(0));
      if(resultado <= 10){
        this.fitMessage = "D";
      } else if (resultado > 10 && resultado <= 30) {
        this.fitMessage = "C";
      } else if (resultado > 30 && resultado <= 60) {
        this.fitMessage = "B";
      } else if (resultado > 60 && resultado <= 80) {
        this.fitMessage = "A";
      } else {
        this.fitMessage = "Enterprise";
      }
      this.fit = (resultado + "%");
      return this.fit, this.fitMessage;
    } else {
      return this.err;
    }
  }

  openModal() {
    const modal = document.getElementById("modalResultado");
    if(modal != null){
      modal.style.display = "block";
      modal.classList.add("show");
    }
  }

  closeModal() {
    const modal = document.getElementById("modalResultado");
    if(modal != null){
      modal.style.display = "none";
      modal.classList.remove("show");
    }
  }

  generatePDF() {
    const doc = new jsPDF();

    // Imagem do PDF
    const logo = '../../../assets/images/logo-nairuz-colorido.png';
    
    doc.addImage(logo, 'PNG', 10,10,40,8);

    doc.text("Validação ICP", 90, 30);

    const formulario = document.getElementById('validacao-icp') as HTMLFormElement;
    const selects = formulario.querySelectorAll('select');

    var valInicial = 40;

    selects.forEach((select: HTMLSelectElement, index) => {
      const campo = select.labels[0].textContent;
      const opcaoSelecionada = select.selectedOptions[0];
      const descricao = opcaoSelecionada.textContent;

      if(index <= 12) {
        doc.setFontSize(12);
        doc.text(`${index + 1} - ${campo}:`, 10, valInicial);
        doc.text(`${descricao}`, 10, valInicial + 5);
        valInicial += 20;
      }

      if(index == 13) {
        doc.addPage();
        doc.addImage(logo, 'PNG', 10,10,40,8);
        valInicial = 30;
      }

      if (index > 12 && index <= 25) {
        doc.setFontSize(12);
        doc.text(`${index + 1} - ${campo}:`, 10, valInicial);
        doc.text(`${descricao}`, 10, valInicial + 5);
        valInicial += 20;
      }

      if(index == 26) {
        doc.addPage();
        doc.addImage(logo, 'PNG', 10,10,40,8);
        valInicial = 30;
      }

      if (index > 25) {
        doc.setFontSize(12);
        doc.text(`${index + 1} - ${campo}:`, 10, valInicial);
        doc.text(`${descricao}`, 10, valInicial + 5);
        valInicial += 20;
      }
    })

    doc.setFontSize(12);
    doc.text(`Percentual de Fit: ${this.fit}`, 10, 50);
    doc.text(`Perfil: ${this.fitMessage}`, 10, 60);
    doc.save("resultado_icp.pdf");
  }

}