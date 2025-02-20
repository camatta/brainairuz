import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { isWeekend, isSameDay, parseISO, differenceInMinutes, differenceInHours, isBefore, isAfter, startOfDay, setHours } from 'date-fns';

import { SharedModule } from 'src/app/modules/shared-module/shared-module.module';
import { OportunidadesService } from 'src/app/services/oportunidades.service';
import { FeriadosNacionais } from 'src/app/services/feriadosNacionais.service';
import { UserService } from 'src/app/services/user.service';
import { Oportunidade } from 'src/app/types/oportunidade';

import { Helper } from 'src/app/lib/helper';

interface EditarOportunidade extends Oportunidade {
  _id: string;
}

@Component({
  selector: 'app-controle-geral',
  templateUrl: './controle-geral.component.html',
  styleUrls: ['./controle-geral.component.css'],
  standalone: true,
  imports: [ SharedModule ]
})

export class ControleGeralComponent implements OnInit {
  msgActions: string;
  tabela: MatTableDataSource<Oportunidade> = new MatTableDataSource<Oportunidade>([]);
  displayedColumns: string[] = [
    "suspect",
    "status",
    "data",
    "ano",
    "mes",
    "origem",
    "fonte",
    "responsavel",
    "primeiro_contato",
    "reuniao_agendada",
    "sla_atendimento",
    "percentual_fit",
    "perfil_cliente",
    "etapa",
    "produto",
    "detalhes_produto",
    "valor_proposta",
    "motivo_perda",
    "valor_vendido",
    "markup",
    "mrr",
    "data_aceite",
    "ciclo_venda",
    "mes_encerramento"
  ];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  loading: boolean = false;
  vendedores: any[] = [];
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  yearsSelectFilter: string[] = [];
  feriadosNacionaisCarregados = [];
  currentTab: number;
  mediaCicloDeVendas: number = 0;
  mediaProjetosVendidos: number = 0;
  mediaDoSlaAtendimento: number = 0;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private oportunidades: OportunidadesService,
    private feriadosNacionais: FeriadosNacionais,
    private users: UserService,
    private _liveAnnouncer: LiveAnnouncer,
    private formBuilder: FormBuilder,
    public helper: Helper
  ){}

  ngOnInit(): void {
    // Carrega as oportunidades do banco
    this.loadOportunidades();

    // Carrega todos os vendedores
    this.loadVendedores();

    // Carrega os feriados nacionais
    this.carregarFeriados(this.currentYear);
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // Toggle para mostrar e esconder a lista de colunas
  toggleListaDeColunas() {
    const lista: HTMLElement = document.querySelector("#listaDeColunas");
    const icone:  HTMLElement =  document.querySelector(".formFiltrarColunas button span.icone");
    
    if(lista.classList.contains("hidden")) {
      lista.classList.toggle("hidden");
      icone.textContent = "-";
    } else {
      lista.classList.toggle("hidden");
      icone.textContent = "+";
    }
  }

  // Submit para filtrar as colunas
  filtrarColunas() {
    const itensLista: HTMLElement[] = Array.from(document.querySelectorAll("#listaDeColunas li"));
    let array: string[] = [];

    itensLista.forEach((item) => {
      const input: HTMLInputElement = item.querySelector("input");
      if(input.checked) {
        array.push(input.name);
      }
    });

    if(array.length > 0) {
      this.columnsToDisplay = array;
    } else {
      this.columnsToDisplay = this.displayedColumns;
    }

    this.toggleListaDeColunas();
  }

  // Função para formatar as labels dos checkbox das colunas
  formatarTextoDaLabel(label: string) {
    let labelFormatada = label.replace("_", " ");
    labelFormatada = labelFormatada.toLowerCase();

    return labelFormatada.charAt(0).toUpperCase() + labelFormatada.slice(1);
  }

  // Formatar status para inserir no span como classe
  formatarTextoDaColunaStatus(texto: string) {
    return texto.replaceAll(" ", "-");
  }

  // MODAL de ação dos produtos
  showMessageAction(message: string) {
    const toast: HTMLElement = document.querySelector("#alert-actions");
    this.msgActions = message;
    setTimeout(() => toast.classList.add('show'), 700);
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // Método para alterar as tabs e trazer o respectivo formulário
  nextTab() {    
    const formTabs: HTMLElement[] = Array.from(document.querySelectorAll("#formEditarOportunidade .formtab"));
    formTabs.forEach((tab: HTMLElement) => {
      if(tab.classList.contains("active")){
        this.currentTab = Number(tab.id.split("-")[1]);
        tab.classList.remove("active");
        tab.classList.add("hidden");
      }
    });

    const tabs: HTMLElement[] = Array.from(document.querySelectorAll("#tabs li"));
    tabs.forEach((tab: HTMLElement) => {
      tab.classList.remove("active");
      if(tab.classList.contains(`etapa-${this.currentTab + 1}`)){
        tab.classList.add("active");
      }
    });

    let nextTab: HTMLElement = document.querySelector(`#etapa-${this.currentTab + 1}`);
    nextTab.classList.remove("hidden");
    nextTab.classList.add("active");

    const nextBtn: HTMLButtonElement = document.querySelector("#formEditarOportunidade .avancar-nairuz");
    const previewBtn: HTMLButtonElement = document.querySelector("#formEditarOportunidade .voltar-nairuz");
    switch(this.currentTab + 1){
      case 1:
        previewBtn.classList.add("hidden");
        nextBtn.classList.remove("hidden");
        break;
      case 2:
        previewBtn.classList.remove("hidden");
        nextBtn.classList.remove("hidden");
        break;
      case 3:
        previewBtn.classList.remove("hidden");
        nextBtn.classList.add("hidden");
        break;
      default:
        previewBtn.classList.remove("hidden");
        nextBtn.classList.remove("hidden");
    }
  }

  previewTab() {
    const formTabs: HTMLElement[] = Array.from(document.querySelectorAll("#formEditarOportunidade .formtab"));
    formTabs.forEach((tab: HTMLElement) => {
      if(tab.classList.contains("active")){
        this.currentTab = Number(tab.id.split("-")[1]);
        tab.classList.remove("active");
        tab.classList.add("hidden");
      }
    });

    const tabs: HTMLElement[] = Array.from(document.querySelectorAll("#tabs li"));
    tabs.forEach((tab: HTMLElement) => {
      tab.classList.remove("active");
      if(tab.classList.contains(`etapa-${this.currentTab - 1}`)){
        tab.classList.add("active");
      }
    });

    let previewTab: HTMLElement = document.querySelector(`#etapa-${this.currentTab - 1}`);
    previewTab.classList.remove("hidden");
    previewTab.classList.add("active");

    const nextBtn: HTMLButtonElement = document.querySelector("#formEditarOportunidade .avancar-nairuz");
    const previewBtn: HTMLButtonElement = document.querySelector("#formEditarOportunidade .voltar-nairuz");
    switch(this.currentTab - 1){
      case 1:
        previewBtn.classList.add("hidden");
        nextBtn.classList.remove("hidden");
        break;
      case 2:
        previewBtn.classList.remove("hidden");
        nextBtn.classList.remove("hidden");
        break;
      case 3:
        previewBtn.classList.remove("hidden");
        nextBtn.classList.add("hidden");
        break;
      default:
        previewBtn.classList.add("hidden");
        nextBtn.classList.remove("hidden");
    }
  }

  submitFormFilter() {
    // Realizar regra para filtros
    const anoSelecionado: HTMLSelectElement = document.querySelector("#years");
    const mesSelecionado: HTMLSelectElement = document.querySelector("#months");
    const statusSelecionado: HTMLSelectElement = document.querySelector("#statusFilter")

    const ano: string = anoSelecionado.selectedOptions[0].value;
    const mes: string = mesSelecionado.selectedOptions[0].value;
    const status: string = statusSelecionado.selectedOptions[0].value;

    this.loadOportunidades(status, mes, ano);
  }

  // Carrega todos os vendedores
  loadVendedores() {
    // Carrega vendedores do time Comercial
    this.users.getUsers().subscribe(
      async(data: any) => {
        data.users.map((user: any) => {
          if(user.team == "Comercial") {
            this.vendedores.push(user.name);
          }
        })
      }, (err) => {
        console.error("Erro ao carregar time comercial: ", err);
      }
    )
  }

  // Carrega as oportunidades lançadas no banco e insere na tabela
  async loadOportunidades(status?: string, mes?: string, ano?: string) {
    this.oportunidades.getOportunidades(status, mes, ano).subscribe(
      async (oportunidades) => {
        console.log(oportunidades);
        // BUSCA OS ANOS PARA INSERIR NO SELECT DO FRONT
        oportunidades.forEach((oportunidade) => {
          const ano = oportunidade.ano;
          if (!this.yearsSelectFilter.includes(ano)) {
            this.yearsSelectFilter.push(ano);
          }
        });
  
        // DEFINE OS ITENS DA TABELA
        this.tabela = new MatTableDataSource<Oportunidade>(oportunidades);
        this.tabela.sort = this.sort;
  
        // Chama a função para calcular a média do SLA
        const mediaDoSla = this.calculaMediaDoSlaAtendimento(this.tabela);
  
        // Chama a função para calcular o ciclo de vendas e projetos vendidos (já existente)
        this.calculaMediaDoCicloDeVendasEProjetosVendidos(this.tabela);
      }, async (error) => {
        console.error(error);
      }
    );
  }
  

  // Método para calcular a SLA Atendimento
calculaMediaDoSlaAtendimento(tabela: MatTableDataSource<Oportunidade>) {
  let somaDoSla: number = 0;
  let mediaDoSla: number = 0;

  tabela.filteredData.forEach((oportunidade) => {
    if(oportunidade.sla_atendimento) {
      somaDoSla += oportunidade.sla_atendimento;  // Somando o valor de sla_atendimento
    }
  });

  // Verifica se há oportunidades para evitar divisão por zero
  if (tabela.filteredData.length > 0) {
    mediaDoSla = somaDoSla / tabela.filteredData.length;
  }

  return this.mediaDoSlaAtendimento = mediaDoSla;
}

  // Função para fazer a busca dentro do input "Produto vendido"
  termoDaBusca: string = "";
  filtrarBarraBusca() {
    let inputText: HTMLInputElement = document.querySelector("#inputBusca");
    this.termoDaBusca = inputText.value;
    
    this.tabela.filter = this.termoDaBusca.trim().toLowerCase();
    
    this.calculaMediaDoCicloDeVendasEProjetosVendidos(this.tabela);

    // Função de filtragem personalizada
    this.tabela.filterPredicate = (data: Oportunidade, filter: string) => {
      return data.suspect.toLowerCase().includes(filter);
    };

    inputText.value = "";
    inputText.blur();
  }

  limparTermoDaBusca() {
    this.termoDaBusca = "";
    this.filtrarBarraBusca();
  }

  // Método para calcular a média de Ciclo de Vendas
  calculaMediaDoCicloDeVendasEProjetosVendidos(tabela: MatTableDataSource<Oportunidade>) {
    let somaDosCiclos: number = 0;
    let somaProjetosVendidos: number = 0;
    let mediaDosCiclosDeVenda: number = 0;
    let mediaDeProjetosVendidos: number = 0;

    tabela.filteredData.forEach((oportunidade) => {
      if(oportunidade.ciclo_venda) {
        somaDosCiclos = mediaDosCiclosDeVenda + oportunidade.ciclo_venda;
        mediaDosCiclosDeVenda = somaDosCiclos / tabela.filteredData.length;
      }

      if(oportunidade.valor_vendido && oportunidade.valor_vendido > 0) {
        somaProjetosVendidos += 1;
        mediaDeProjetosVendidos = somaProjetosVendidos / tabela.filteredData.length;
      }
    });

    return this.mediaCicloDeVendas = mediaDosCiclosDeVenda, this.mediaProjetosVendidos = mediaDeProjetosVendidos;
  }

  // Método para copiar textos para a área de transferência
  async copiarParaAreaDeTransferencia(texto: number) {
    try {
      await navigator.clipboard.writeText(texto.toString());
      this.showMessageAction('Texto copiado com sucesso!');
    } catch (err) {
      this.showMessageAction('Falha ao copiar');
      console.error('Falha ao copiar:', err);
    }
  }

  // Método para carregar os feriados nacionais da API
  async carregarFeriados(year: number) {
    const apiFeriados = await this.feriadosNacionais.getFeriadosNacionais(year).toPromise();

    // Insere feriados em um array de datas
    apiFeriados.map((feriado) => {
      this.feriadosNacionaisCarregados.push(new Date(feriado.date));
    });
  }

  // Método para cálculo de dias úteis
  calculaDiasUteis(dataInicial: string, dataFinal: string) {
    // Parse as datas para objetos Date
    const inicio = parseISO(dataInicial);
    const fim = parseISO(dataFinal);
    const feriados = this.feriadosNacionaisCarregados;
    const margemErro = 1000 * 60 * 60; // 1 hora em milissegundos

    // Inicializa o contador de dias úteis
    let diasUteis = 0;

    if(feriados) {
      // Itera sobre cada dia entre as datas
      for (let dataAtual = inicio; dataAtual.getTime() <= fim.getTime(); dataAtual.setDate(dataAtual.getDate() + 1)) {
        // Verifica se o dia não é fim de semana e não é feriado
        if (!isWeekend(dataAtual) && !this.feriadosNacionaisCarregados.some(feriado => isSameDay(dataAtual, feriado))) {
          diasUteis++;
        }
      }

      return diasUteis;
    }

    return "Feriados não carregados";
  }

  // Método para validar o horário de atendimento, padronizando para 08h inicio e 18h fim
  validaHorarioDeAtendimento(inicio: Date, fim: Date) {

    if(isBefore(inicio, setHours(startOfDay(inicio), 8))) {
      inicio = startOfDay(inicio);
      inicio = setHours(inicio, 8);
    };

    if(isAfter(inicio, setHours(startOfDay(inicio), 18))) {
      inicio = startOfDay(inicio);
      inicio = setHours(inicio, 18);
    };

    if(isBefore(fim, setHours(startOfDay(fim), 8))) {
      fim = startOfDay(fim);
      fim = setHours(fim, 8);
    };

    if(isAfter(fim, setHours(startOfDay(fim), 18))) {
      fim = startOfDay(fim);
      fim = setHours(fim, 18);
    };

    return {
      inicioReal: inicio,
      fimReal: fim
    }
  }

  // Método para cálculo do SLA de Atendimento
  calculaSlaDeAtendimento(dataInicial: string, dataFinal: string): number {
    const inicio = parseISO(dataInicial);
    const fim = parseISO(dataFinal);
    const { inicioReal, fimReal } = this.validaHorarioDeAtendimento(inicio, fim);
    
    const diasUteis = this.calculaDiasUteis(dataInicial, dataFinal); // formula DIATRABALHOTOTAL


    if(typeof(diasUteis) === "number") {
      const minutosUteis = diasUteis * 10 * 60; // 10 horas trabalhadas por dia em minutos
      const diferencaEntreAsDatasEmMinutos: number = differenceInMinutes(fimReal, inicioReal);
      const diferencaEntreAsDatasEmMinutosTrabalhados = diferencaEntreAsDatasEmMinutos >= 1440 ? ((diferencaEntreAsDatasEmMinutos / 60) / 24) * 10 * 60 : diferencaEntreAsDatasEmMinutos;

      if(!dataInicial) {
        console.log("Não tenho data inicial!");
        return 0;
      }

      if(!dataFinal) {
        console.log("Não agendado");
        return null;
      }

      let resultado = ((minutosUteis - diferencaEntreAsDatasEmMinutosTrabalhados) / (24 * 60)).toFixed(2);

      return Number(resultado);
    } else {
      return null;
    }
  }
  
  // Método para cálculo do ciclo de venda
  calculaCiclodeVendas(dataInicial: string, dataDoAceite: string) {
    const inicio = parseISO(dataInicial);
    const fim = parseISO(dataDoAceite);

    // Obtendo os timestamps
    const timestampInicial = inicio.getTime();
    const timestampFinal = fim.getTime();

    // Calculando a diferença em milissegundos e convertendo para dias
    const diferencaEmMilissegundos = timestampFinal - timestampInicial;
    const diferencaEmDias = diferencaEmMilissegundos / (1000 * 60 * 60 * 24);

    return diferencaEmDias;
  }

  formEditarOportunidade = this.formBuilder.group({
    id: [''],

    // primeiro form
    data: [''],
    mes: [''],
    ano: [''],
    suspect: [''],
    origem: [''],
    fonte: [''],
    responsavel: [''],

    // segundo form
    primeiro_contato: [''],
    status: [''],
    reuniao_agendada: [''],
    sla_atendimento: [0],
    percentual_fit: [''],
    perfil_cliente: [''],
    etapa: [''],
    produto: [''],
    detalhes_produto: [''],
    valor_proposta: [0],

    // terceiro form
    motivo_perda: [''],
    valor_vendido: [0],
    markup: [0],
    mrr: [0],
    data_aceite: [''],
    ciclo_venda: [0],
    mes_encerramento: ['']
  })

  // Método para alterar o SLA sempre que a Data ou o Primeiro Contato for alterado
  handleChangeDateOrFirstContact() {
    const dataInicial = this.formEditarOportunidade.get("data").value;
    const primeiroContato = this.formEditarOportunidade.get("primeiro_contato").value;

    if(dataInicial && primeiroContato) {
      this.formEditarOportunidade.patchValue({ sla_atendimento: this.calculaSlaDeAtendimento(dataInicial, primeiroContato) })
    } else {
      this.formEditarOportunidade.patchValue({ sla_atendimento: null });
    }
  }

  // Método para alterar o SLA sempre que a Data ou o Primeiro Contato for alterado
  handleChangeAcceptanceDate() {
    const dataInicial = this.formEditarOportunidade.get("data").value;
    const dataDoAceite = this.formEditarOportunidade.get("data_aceite").value;

    if(dataInicial && dataDoAceite) {
      this.formEditarOportunidade.patchValue({ sla_atendimento: this.calculaCiclodeVendas(dataInicial, dataDoAceite) })
    } else {
      this.formEditarOportunidade.patchValue({ sla_atendimento: null });
    }
  }

  openModalEditarOportunidade(element: EditarOportunidade) {
    const modal = document.getElementById("modalEdit");
    const bgModal = document.getElementById("bg-modal");

    const dataInicial = this.helper.setFormatarDataParaHtmlInput(element.data);
    const primeiroContato = this.helper.setFormatarDataParaHtmlInput(element.primeiro_contato);
    const reuniaoAgendada = this.helper.setFormatarDataParaHtmlInput(element.reuniao_agendada);
    const dataAceite = this.helper.setFormatarDataParaHtmlInput(element.data_aceite);
    let slaDeAtendimento: number;
    let cicloDeVenda: number;

    if(dataInicial && primeiroContato) {
      slaDeAtendimento = this.calculaSlaDeAtendimento(dataInicial.dataFormatada, primeiroContato.dataFormatada);
    }

    if(dataAceite) {
      cicloDeVenda = this.calculaCiclodeVendas(dataInicial.dataFormatada, dataAceite.dataFormatada);
    }

    this.formEditarOportunidade.patchValue({
      id: element._id,
      data: dataInicial ? dataInicial.dataFormatada : null,
      mes: element.mes,
      ano: element.ano,
      suspect: element.suspect,
      origem: element.origem,
      fonte: element.fonte,
      responsavel: element.responsavel,
      primeiro_contato: primeiroContato ? primeiroContato.dataFormatada : null,
      status: element.status,
      reuniao_agendada: reuniaoAgendada ? reuniaoAgendada.dataFormatada : null,
      sla_atendimento: slaDeAtendimento,
      percentual_fit: element.percentual_fit,
      perfil_cliente: element.perfil_cliente,
      etapa: element.etapa,
      produto: element.produto,
      detalhes_produto: element.detalhes_produto,
      valor_proposta: element.valor_proposta,
      motivo_perda: element.motivo_perda,
      valor_vendido: element.valor_vendido,
      markup: element.markup,
      mrr: element.mrr,
      data_aceite: dataAceite ? dataAceite.dataFormatada : null,
      ciclo_venda: cicloDeVenda,
      mes_encerramento: element.mes_encerramento
    })

    if(modal != null){
      modal.style.display = "block";
      bgModal.style.display = "block";
      modal.classList.add("show");
    }
  }

  closeModalEditarOportunidade() {
    const modal = document.getElementById("modalEdit");
    const bgModal = document.getElementById("bg-modal");
    if(modal != null){
      modal.style.display = "none";
      bgModal.style.display = "none";
      modal.classList.remove("show");
    }

    this.formEditarOportunidade = this.formBuilder.group({
      id: [''],
  
      // primeiro form
      data: [''],
      mes: [''],
      ano: [''],
      suspect: [''],
      origem: [''],
      fonte: [''],
      responsavel: [''],
  
      // segundo form
      primeiro_contato: [''],
      status: [''],
      reuniao_agendada: [''],
      sla_atendimento: [0],
      percentual_fit: [''],
      perfil_cliente: [''],
      etapa: [''],
      produto: [''],
      detalhes_produto: [''],
      valor_proposta: [0],
  
      // terceiro form
      motivo_perda: [''],
      valor_vendido: [0],
      markup: [0],
      mrr: [0],
      data_aceite: [''],
      ciclo_venda: [0],
      mes_encerramento: ['']
    });
  }

  onSubmitEditarOportunidade(){
    let id: string = this.formEditarOportunidade.get("id").value;

    // primeiro form
    let data: string = this.formEditarOportunidade.get("data").value;
    let suspect: string = this.formEditarOportunidade.get("suspect").value;
    let origem: string = this.formEditarOportunidade.get("origem").value;
    let fonte: string = this.formEditarOportunidade.get("fonte").value;
    let responsavel: string = this.formEditarOportunidade.get("responsavel").value;

    // segundo form
    let primeiro_contato: string = this.formEditarOportunidade.get("primeiro_contato").value;
    let status: string = this.formEditarOportunidade.get("status").value;
    let reuniao_agendada: string = this.formEditarOportunidade.get("reuniao_agendada").value;
    let sla_atendimento: number = this.formEditarOportunidade.get("sla_atendimento").value;
    let percentual_fit: string = this.formEditarOportunidade.get("percentual_fit").value;
    let perfil_cliente: string = this.formEditarOportunidade.get("perfil_cliente").value;
    let etapa: string = this.formEditarOportunidade.get("etapa").value;
    let produto: string = this.formEditarOportunidade.get("produto").value;
    let detalhes_produto: string = this.formEditarOportunidade.get("detalhes_produto").value;
    let valor_proposta: number = Number(this.formEditarOportunidade.get("valor_proposta").value);

    // terceiro form
    let motivo_perda: string = this.formEditarOportunidade.get("motivo_perda").value;
    let valor_vendido: number = this.formEditarOportunidade.get("valor_vendido").value;
    let markup: number = this.formEditarOportunidade.get("markup").value;
    let mrr: number = this.formEditarOportunidade.get("mrr").value;
    let data_aceite: string = this.formEditarOportunidade.get("data_aceite").value;
    let ciclo_venda: number = this.formEditarOportunidade.get("ciclo_venda").value;
    let mes_encerramento: string = this.formEditarOportunidade.get("mes_encerramento").value;

    //Formatando data
    let dataSeparada = String(data).split("-");
    let mes = this.helper.setMes(dataSeparada[1]);
    let ano = dataSeparada[0];

    const editarOportunindade: Oportunidade = {
      data: data ? new Date(data) : null,
      mes: mes,
      ano: ano,
      suspect: suspect,
      origem: origem,
      fonte: fonte,
      responsavel: responsavel,
      primeiro_contato: primeiro_contato ? new Date(primeiro_contato) : null,
      status: status,
      reuniao_agendada: reuniao_agendada ? new Date(reuniao_agendada) : null,
      sla_atendimento: sla_atendimento,
      percentual_fit: percentual_fit,
      perfil_cliente: perfil_cliente,
      etapa: etapa,
      produto: produto,
      detalhes_produto: detalhes_produto,
      valor_proposta: valor_proposta,
      motivo_perda: motivo_perda,
      valor_vendido: valor_vendido,
      markup: markup,
      mrr: mrr,
      data_aceite: data_aceite ? new Date(data_aceite) : null,
      ciclo_venda: ciclo_venda,
      mes_encerramento: mes_encerramento
    }

    this.oportunidades.updateOportunidade(id, editarOportunindade).subscribe(
      async (res) => {
        console.log(res, editarOportunindade);
        await this.loadOportunidades();
        this.tabela._updateChangeSubscription();
        this.showMessageAction("Oportunidade editada com sucesso");
        this.closeModalEditarOportunidade();
      }, async (error) => {
        console.log(error);
        console.log(editarOportunindade);
        console.error(`Erro ao criar a oportunidade: ${error}`);
      }
    )
    
  }
}
