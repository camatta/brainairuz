import { Component, OnInit, ViewChild, AfterViewInit, signal, effect, Injector, runInInjectionContext } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { parseISO, startOfDay, addDays, isBefore, max, min } from 'date-fns';

import { SharedModule } from 'src/app/modules/shared-module/shared-module.module';
import { OportunidadesService } from 'src/app/services/oportunidades.service';
import { FeriadosNacionais } from 'src/app/services/feriadosNacionais.service';
import { UserService } from 'src/app/services/user.service';
import { Oportunidade } from 'src/app/types/oportunidade';

import { Helper } from 'src/app/lib/helper';

interface EditarOportunidade extends Oportunidade {
  _id: string;
}

type WorkWindow = { startMin: number; endMin: number };

@Component({
  selector: 'app-controle-geral',
  templateUrl: './controle-geral.component.html',
  styleUrls: ['./controle-geral.component.css'],
  standalone: true,
  imports: [ SharedModule ]
})

export class ControleGeralComponent implements OnInit, AfterViewInit {
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
  feriadosNacionaisCarregados = [];
  currentTab: number;
  mediaCicloDeVendas: number = 0;
  mediaProjetosVendidos: number = 0;
  mediaDoSlaAtendimento: number = 0;
  mediaDoTicket: number = 0;
  mediaDoIcp: number = 0;

  // sinais do store/service (read-only)
  readonly oportunidadesSig = this.oportunidades.oportunidades;
  readonly loadingSig = this.oportunidades.loading;
  readonly errorSig = this.oportunidades.error;

  // busca local (client-side)
  readonly termoDaBuscaSig = signal<string>('');

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private oportunidades: OportunidadesService,
    private feriadosNacionais: FeriadosNacionais,
    private users: UserService,
    private _liveAnnouncer: LiveAnnouncer,
    private formBuilder: FormBuilder,
    public helper: Helper,
    private injector: Injector
  ){}

  ngOnInit(): void {
    // Carrega as oportunidades do banco
    this.oportunidades.load({ ano: this.currentYear.toString() });

    // Carrega todos os vendedores
    this.loadVendedores();

    // Carrega os feriados nacionais
    this.carregarFeriados(this.currentYear);

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const lista = this.oportunidadesSig();
        const termo = this.termoDaBuscaSig().trim().toLocaleLowerCase();

        const listaFiltrada = termo ? lista.filter(oportunidade => (oportunidade.suspect ?? "").toLowerCase().includes(termo)) : lista;

        this.tabela.data = listaFiltrada;

        this.calculaMediaDoCicloDeVendasEProjetosVendidos(this.tabela);
        this.calculaMediaDoSlaAtendimento(this.tabela);
        this.calculaTicketMedio(this.tabela);
        this.calculaMediaIcp(this.tabela);
      });
    });
  }

  ngAfterViewInit(): void {
    this.tabela.sort = this.sort;
  }

  // Announce the change in sort state for assistive technology.
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // Toggle para mostrar e esconder barra lateral com os filtros
  sidebarToggle() {
    const sidebar = document.querySelector("#sidebarFilters");
    sidebar.classList.toggle("hidden");
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
    if (texto && texto.includes(" ")) {
      return texto.replaceAll(" ", "-");
    }
    return texto;
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
    const sidebarFilters: NodeListOf<HTMLSelectElement> = document.querySelectorAll("#sidebarFilters select");
    const filters: Partial<Oportunidade> = {};

    sidebarFilters.forEach((select: HTMLSelectElement) => {
      const filterName = select.name as keyof Oportunidade;
      const filterValue = select.value;

      if (filterValue) {
        // Converte o valor com base no tipo esperado pelo campo
        switch (filterName) {
          case 'data':
          case 'primeiro_contato':
          case 'reuniao_agendada':
          case 'data_aceite':
            filters[filterName] = new Date(filterValue); // Converte string para Date
            break;
          case 'sla_atendimento':
          case 'valor_proposta':
          case 'valor_vendido':
          case 'markup':
          case 'mrr':
          case 'ciclo_venda':
            filters[filterName] = Number(filterValue); // Converte string para number
            break;
          default:
            filters[filterName] = filterValue; // Mantém como string para os outros campos
            break;
        }
      }
    });

    this.oportunidades.load(filters);
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
  

  // Método para calcular a SLA Atendimento
  calculaMediaDoSlaAtendimento(tabela: MatTableDataSource<Oportunidade>) {
    let soma = 0;
    let count = 0;

    tabela.filteredData.forEach((oportunidade) => {
      const sla = oportunidade.sla_atendimento;

      // conta apenas valores numéricos válidos (inclui 0)
      if (sla != null && !Number.isNaN(sla)) {
        soma += sla;
        count += 1;
      }
    });

    const media = count > 0 ? soma / count : 0;

    this.mediaDoSlaAtendimento = media; // em minutos
    return media;
  }

  // Método para calcular o Ticket Médio
  calculaTicketMedio(tabela: MatTableDataSource<Oportunidade>) {
    let somaDoTicket: number = 0;
    let mediaDoTicket: number = 0;

    tabela.filteredData.forEach((oportunidade) => {
      if(oportunidade.valor_vendido) {
        somaDoTicket += oportunidade.valor_vendido;  // Somando o valor do ticket
      }
    });

    // Verifica se há oportunidades para evitar divisão por zero
    if (tabela.filteredData.length > 0) {
      mediaDoTicket = somaDoTicket / tabela.filteredData.length;
    }

    return this.mediaDoTicket = mediaDoTicket;
  }

  // Método para calcular a SLA Atendimento
  calculaMediaIcp(tabela: MatTableDataSource<Oportunidade>) {
    let somaDoIcp: number = 0;
    let mediaDoIcp: number = 0;

    tabela.filteredData.forEach((oportunidade) => {
      if(oportunidade.percentual_fit) {
        somaDoIcp += Number(oportunidade.percentual_fit);  // Somando o valor do ticket
      }
    });

    // Verifica se há oportunidades para evitar divisão por zero
    if (tabela.filteredData.length > 0) {
      mediaDoIcp = somaDoIcp / tabela.filteredData.length;
    }

    return this.mediaDoIcp = mediaDoIcp;
  }

  // Função para fazer a busca dentro do input "Produto vendido"
  filtrarBarraBusca() {
    const inputText = document.querySelector("#inputBusca") as HTMLInputElement;
    this.termoDaBuscaSig.set(inputText.value || "");

    inputText.value = "";
    inputText.blur();
  }

  limparTermoDaBusca() {
    this.termoDaBuscaSig.set("");
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

  // Método para copiar textos para a área de transferência
  async copiarTextoFormatadoParaAreaDeTransferencia(texto: number) {
    try {
      let textoFormatado = this.formatarSlaAtendimento(texto);
      await navigator.clipboard.writeText(textoFormatado);
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

  // NOVA IMPLEMENTAÇÃO DE SLA DE ATENDIMENTO COM FORMATAÇÃO NO FRONT
  // SLA (minutos úteis) - Seg a Qui 08-18, Sex 08-17, ignora feriados e finais de semana
  private SHIFT_START_MIN = 8 * 60;        // 08:00
  private SHIFT_END_MIN_MON_THU = 18 * 60; // 18:00
  private SHIFT_END_MIN_FRI = 17 * 60;     // 17:00

  private isWeekend(d: Date): boolean {
    const day = d.getDay(); // 0 dom ... 6 sáb
    return day === 0 || day === 6;
  }

  // importante: chave local (não UTC) para não “virar o dia”
  private toYMDLocal(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private workWindowForDay(d: Date): WorkWindow {
    const day = d.getDay(); // 1..5 úteis
    const end = (day === 5) ? this.SHIFT_END_MIN_FRI : this.SHIFT_END_MIN_MON_THU;
    return { startMin: this.SHIFT_START_MIN, endMin: end };
  }

  private atMinutes(d: Date, minInDay: number): Date {
    const base = startOfDay(d);
    base.setHours(Math.floor(minInDay / 60), minInDay % 60, 0, 0);
    return base;
  }

  private getHolidaysSetFromLoaded(): Set<string> {
    // seu array já é Date[] (carregado em carregarFeriados)
    return new Set(this.feriadosNacionaisCarregados.map((dt: Date) => this.toYMDLocal(dt)));
  }

  /**
   * Retorna minutos úteis entre duas datas ISO (ex: "2026-01-01T11:39" ou "2026-01-01")
   * Observação: se vier "dd/MM/yyyy", parseISO NÃO funciona. Aqui no seu fluxo está vindo "yyyy-MM-dd" do input, então ok.
   */
  private workingMinutesBetween(startISO: string, endISO: string): number {
    if (!startISO || !endISO) return 0;

    const start = parseISO(startISO);
    const end = parseISO(endISO);

    // se invertido ou igual, retorna 0
    if (!isBefore(start, end)) return 0;

    const holidays = this.getHolidaysSetFromLoaded();

    let total = 0;
    let dayCursor = startOfDay(start);
    const endDay = startOfDay(end);

    while (isBefore(dayCursor, addDays(endDay, 1))) {
      const dayKey = this.toYMDLocal(dayCursor);

      if (!this.isWeekend(dayCursor) && !holidays.has(dayKey)) {
        const win = this.workWindowForDay(dayCursor);

        const dayWorkStart = this.atMinutes(dayCursor, win.startMin);
        const dayWorkEnd = this.atMinutes(dayCursor, win.endMin);

        const intervalStart = max([start, dayWorkStart]);
        const intervalEnd = min([end, dayWorkEnd]);

        if (isBefore(intervalStart, intervalEnd)) {
          const diffMin = Math.floor((intervalEnd.getTime() - intervalStart.getTime()) / 60000);
          total += diffMin;
        }
      }

      dayCursor = addDays(dayCursor, 1);
    }

    return total;
}

  /**
   * Formata minutos úteis para exibir no front.
   * Regra: 1 "dia útil" = jornada inteira do dia (10h seg-qui, 9h sex), e o resto vira horas/minutos.
   * Para simplificar e ficar estável: mostramos "X dias úteis" como blocos de 10h (seg-qui).
   * Se você quiser 100% literal (contando sexta como dia completo de 9h), eu te passo uma versão também.
   */
  formatarSlaAtendimento(minutosUteis: number | null | undefined): string {
    if (minutosUteis == null || Number.isNaN(minutosUteis)) return '-';

    const total = Math.max(0, Math.floor(minutosUteis));

    const dayMin = 10 * 60; // padrão seg-qui
    const dias = Math.floor(total / dayMin);
    const resto = total % dayMin;

    const horas = Math.floor(resto / 60);
    const minutos = resto % 60;

    const parts: string[] = [];
    if (dias) parts.push(`${dias} dia${dias > 1 ? 's' : ''}`);
    if (horas) parts.push(`${horas} hora${horas > 1 ? 's' : ''}`);
    if (minutos || parts.length === 0) parts.push(`${minutos} minuto${minutos > 1 ? 's' : ''}`);

    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return `${parts[0]} e ${parts[1]}`;
    return `${parts[0]}, ${parts[1]} e ${parts[2]}`;
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
      this.formEditarOportunidade.patchValue({ sla_atendimento: this.workingMinutesBetween(dataInicial, primeiroContato) })
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
      slaDeAtendimento = this.workingMinutesBetween(dataInicial.dataFormatada, primeiroContato.dataFormatada);
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
        this.oportunidades.load();
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
