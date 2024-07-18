import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { SharedModule } from 'src/app/modules/shared-module/shared-module.module';
import { OportunidadesService } from 'src/app/services/oportunidades.service';
import { UserService } from 'src/app/services/user.service';
import { Oportunidade } from 'src/app/types/oportunidade';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-controle-geral',
  templateUrl: './controle-geral.component.html',
  styleUrls: ['./controle-geral.component.css'],
  standalone: true,
  imports: [ SharedModule ]
})

export class ControleGeralComponent implements OnInit {
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
  loading: boolean = false;
  vendedores: any[] = [];
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  yearsSelectFilter = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private oportunidades: OportunidadesService,
    private users: UserService,
    private _liveAnnouncer: LiveAnnouncer,
    private formBuilder: FormBuilder,
  ){}

  ngOnInit(): void {
    // Carrega as oportunidades do banco
    this.loadOportunidades();

    // Carrega todos os vendedores
    this.loadVendedores();

    // Tradução do Paginator
    this.paginator._intl.itemsPerPageLabel="Itens por página";
    this.paginator._intl.nextPageLabel="Próxima";
    this.paginator._intl.previousPageLabel="Anterior";
    this.paginator._intl.firstPageLabel="Primeira Página";
    this.paginator._intl.lastPageLabel="Última Página";
    this.paginator._intl.getRangeLabel = (page, pageSize, length) => {
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  submitFormFilter() {
    // Realizar regra para filtros
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

  loadOportunidades() {
    this.oportunidades.getOportunidades().subscribe(
      async (response) => {
        this.tabela = new MatTableDataSource<Oportunidade>(response);
      }, async (error) => {
        console.error(error);
      }
    )
  }

  formEditarOportunidade = this.formBuilder.group({
    data: [new Date(), Validators.required],
    mes: ['', Validators.required],
    ano: ['', Validators.required],
    suspect: ['', Validators.required],
    origem: ['', Validators.required],
    fonte: ['', Validators.required],
    responsavel: ['', Validators.required],
    primeiro_contato: [new Date(), Validators.required],
    status: ['', Validators.required],
    reuniao_agendada: ['', Validators.required],
    sla_atendimento: [0, Validators.required],
    percentual_fit: ['', Validators.required],
    perfil_cliente: ['', Validators.required],
    etapa: ['', Validators.required],
    produto: ['', Validators.required],
    detalhes_produto: ['', Validators.required],
    valor_proposta: [0, Validators.required],
    motivo_perda: ['', Validators.required],
    valor_vendido: [0, Validators.required],
    markup: [0, Validators.required],
    mrr: [0, Validators.required],
    data_aceite: [new Date(), Validators.required],
    ciclo_venda: [0, Validators.required],
    mes_encerramento: ['', Validators.required]
  })

  openModalEditarOportunidade(element: Oportunidade){
    const modal = document.getElementById("modalEdit");
    const bgModal = document.getElementById("bg-modal");

    const dataSplit = String(element.data).split("-");
    const mes = Number(dataSplit[1]);
    const ano = Number(dataSplit[0]);
    const daySplit = dataSplit[2].split("T");
    const dia = Number(daySplit[0]);
    const hourSplit = daySplit[1].split(":");
    const hora = Number(hourSplit[0]);
    const minuto = Number(hourSplit[1]);

    const dataGerada = new Date(ano, mes, dia, hora, minuto);
    const dataFormatada = dataGerada.toISOString().slice(0, 16);

    console.log(element.data);
    console.log(dataGerada);


    this.formEditarOportunidade = this.formBuilder.group({
      data: new Date(ano, mes, dia, hora, minuto),
      mes: element.mes,
      ano: element.ano,
      suspect: element.suspect,
      origem: element.origem,
      fonte: element.fonte,
      responsavel: element.responsavel,
      primeiro_contato: [new Date(), Validators.required],
      status: ['', Validators.required],
      reuniao_agendada: ['', Validators.required],
      sla_atendimento: [0, Validators.required],
      percentual_fit: ['', Validators.required],
      perfil_cliente: ['', Validators.required],
      etapa: ['', Validators.required],
      produto: ['', Validators.required],
      detalhes_produto: ['', Validators.required],
      valor_proposta: [0, Validators.required],
      motivo_perda: ['', Validators.required],
      valor_vendido: [0, Validators.required],
      markup: [0, Validators.required],
      mrr: [0, Validators.required],
      data_aceite: [new Date(), Validators.required],
      ciclo_venda: [0, Validators.required],
      mes_encerramento: ['', Validators.required]
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
  }

  onSubmitEditarOportunidade(){

  }
}
