import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { isWeekend, isSameDay, parseISO, differenceInMinutes } from 'date-fns';

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
  currentTab: number;

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

    this.calculaSlaDeAtendimento("2024-12-02T09:20:00Z", "2024-12-02T14:00:00Z");
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
        // BUSCA OS ANOS PARA INSERIR NO SELECT DO FRONT
        oportunidades.forEach((oportunidade) => {
          const ano = oportunidade.ano;
          if(!this.yearsSelectFilter.includes(ano)){
            this.yearsSelectFilter.push(ano);
          } 
        })

        // DEFINE OS ITENS DA TABELA
        this.tabela = new MatTableDataSource<Oportunidade>(oportunidades);
        this.tabela.sort = this.sort;
      }, async (error) => {
        console.error(error);
      }
    )
  }

  // Função para fazer a busca dentro do input "Produto vendido"
  termoDaBusca: string = "";
  filtrarBarraBusca() {
    let inputText: HTMLInputElement = document.querySelector("#inputBusca");
    this.termoDaBusca = inputText.value;
    
    this.tabela.filter = this.termoDaBusca.trim().toLowerCase();
    
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

  // Método para cálculo de dias úteis
  async calculaDiasUteis(dataInicial: string, dataFinal: string) {
    // Parse as datas para objetos Date
    const inicio = parseISO(dataInicial);
    const fim = parseISO(dataFinal);
    const apiFeriados = await this.feriadosNacionais.getFeriadosNacionais(2024).toPromise();
    let feriados: Date[] = [];

    // Insere feriados em um array de datas
    apiFeriados.map((feriado) => {
      feriados.push(new Date(feriado.date));
    })

    // Inicializa o contador de dias úteis
    let diasUteis = 0;

    // Itera sobre cada dia entre as datas
    for (let dataAtual = inicio; isSameDay(dataAtual, fim) === false; dataAtual.setDate(dataAtual.getDate() + 1)) {
      // Verifica se o dia não é fim de semana e não é feriado
      if (!isWeekend(dataAtual) && !feriados.some(feriado => isSameDay(dataAtual, feriado))) {
        diasUteis++;
      }
    }

    return diasUteis;
  }

  // Método para cálculo do SLA de Atendimento
  async calculaSlaDeAtendimento(dataInicial: string, dataFinal: string) {
    const inicio = parseISO(dataInicial);
    const fim = parseISO(dataFinal);

    const diasUteis: number = await this.calculaDiasUteis(dataInicial, dataFinal);
    const horasUteis = diasUteis * 10; // 10 horas trabalhadas por dia
    const diferencaEntreAsDatasEmHoras: number = differenceInMinutes(fim, inicio);

    const diaEmMinutos = 24 * 60;

    if(!dataInicial) {
      console.log("Sem data inicial preenchida");
      return 0;
    }

    if(!dataFinal) {
      console.log("Não agendado");
      return "Não agendado";
    }

    if(diferencaEntreAsDatasEmHoras === 0) {
      console.log("Diferença entre as datas em minutos: ", 0);
      return 0;
    } else if(diferencaEntreAsDatasEmHoras > 0) {
      console.log("Diferença entre as datas em minutos: ", diferencaEntreAsDatasEmHoras / diaEmMinutos);
      return diferencaEntreAsDatasEmHoras / diaEmMinutos;
    }

    // PRECISO DIVIDIR O RESULTADO POR 24H / 60MIN PARA CHEGAR NO VALOR DECIMAL DA PLANILHA (0,22)

    console.log("Minutos úteis: ", horasUteis);
    return horasUteis;
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
    primeiro_contato: [new Date()],
    status: [''],
    reuniao_agendada: [new Date()],
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
    data_aceite: [new Date()],
    ciclo_venda: [0],
    mes_encerramento: ['']
  })

  openModalEditarOportunidade(element: EditarOportunidade) {
    const modal = document.getElementById("modalEdit");
    const bgModal = document.getElementById("bg-modal");

    const dataInicial = this.helper.setFormatarDataParaHtmlInput(element.data);

    this.formEditarOportunidade.patchValue({
      id: element._id,
      data: dataInicial.dataFormatada,
      mes: element.mes,
      ano: element.ano,
      suspect: element.suspect,
      origem: element.origem,
      fonte: element.fonte,
      responsavel: element.responsavel,
      primeiro_contato: element.primeiro_contato,
      status: element.status,
      reuniao_agendada: element.reuniao_agendada,
      sla_atendimento: element.sla_atendimento,
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
      data_aceite: element.data_aceite,
      ciclo_venda: element.ciclo_venda,
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
      primeiro_contato: [new Date()],
      status: [''],
      reuniao_agendada: [new Date()],
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
      data_aceite: [new Date()],
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
    let primeiro_contato: Date = this.formEditarOportunidade.get("primeiro_contato").value;
    let status: string = this.formEditarOportunidade.get("status").value;
    let reuniao_agendada: Date = this.formEditarOportunidade.get("reuniao_agendada").value;
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
    let data_aceite: Date = this.formEditarOportunidade.get("data_aceite").value;
    let ciclo_venda: number = this.formEditarOportunidade.get("ciclo_venda").value;
    let mes_encerramento: string = this.formEditarOportunidade.get("mes_encerramento").value;

    //Formatando data
    let dataSeparada = String(data).split("-");
    let mes = this.helper.setMes(dataSeparada[1]);
    let ano = dataSeparada[0];

    const editarOportunindade: Oportunidade = {
      data: new Date(data),
      mes: mes,
      ano: ano,
      suspect: suspect,
      origem: origem,
      fonte: fonte,
      responsavel: responsavel,
      primeiro_contato: primeiro_contato,
      status: status,
      reuniao_agendada: reuniao_agendada,
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
      data_aceite: data_aceite,
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
