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
  nomeEmpresaInput: string = "...";
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

  setNomeEmpresa(nomeEmpresa: string) {
    this.nomeEmpresaInput = nomeEmpresa;
  }

  setSiteEmpresa(siteEmpresa: string) {
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

    doc.text(`Validação ICP: ${this.nomeEmpresaInput}`, 100, 30, {align: 'center'});

    const formulario = document.getElementById('validacao-icp') as HTMLFormElement;
    const selects = formulario.querySelectorAll('select');

    var valInicial = 50;

    selects.forEach((select: HTMLSelectElement, index) => {
      const campo = select.labels[0].textContent;
      const opcaoSelecionada = select.selectedOptions[0];
      const descricao = opcaoSelecionada.textContent;

      doc.setFontSize(12);

      if(index <= 23) {
        doc.text(`${index + 1} - ${campo}: ${descricao}`, 10, valInicial);
        valInicial += 10;
      }

      if(index == 24) {
        doc.addPage();
        doc.addImage(logo, 'PNG', 10,10,40,8);
        valInicial = 40;
      }

      if (index >= 24 && index <= 30) {
        doc.text(`${index + 1} - ${campo}: ${descricao}`, 10, valInicial);
        valInicial += 10;
      }
    })

    doc.setFontSize(16);
    doc.text(`Percentual de Fit: ${this.fit}`, 10, 80);
  
    const fitMessage = this.fitMessage;
    function addTableCell(doc: jsPDF, text: string, x: number, y: number, width: number, height: number) {
      
      if(fitMessage == "Enterprise") {
        doc.setFillColor(72, 186, 184);
      } else if (fitMessage == "A") {
        doc.setFillColor(0, 213, 0);
      } else if (fitMessage == "B") {
        doc.setFillColor(193, 193, 0);
      } else if (fitMessage == "C") {
        doc.setFillColor(255, 192, 0);
      } else if (fitMessage == "D") {
        doc.setFillColor(0, 0, 255);
      } else if (fitMessage == "") {
        doc.setFillColor(168, 168, 168);
      }
      doc.setTextColor(255, 255, 255); // Cor do texto branco (RGB)
      doc.setDrawColor(0, 0, 0); // Cor da borda preta (RGB)
    
      doc.rect(x, y, width, height, 'FD')
    
      const fontSize = doc.getFontSize(); // Obtém o tamanho da fonte
      const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
      const textX = x + (width - textWidth) / 2;
      const textY = y + height / 2 + fontSize / 8; // Ajusta a posição vertical para o centro da célula
      doc.text(text, textX, textY);
    }

    addTableCell(doc, `Perfil: ${this.fitMessage}`, 10, 83, 70, 10);

    const docName = this.nomeEmpresaInput.replace(/ /g, '_');
    doc.save(`${docName}_icp.pdf`);
  }

}