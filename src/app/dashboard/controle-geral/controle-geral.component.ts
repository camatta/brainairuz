import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { SharedModule } from 'src/app/modules/shared-module/shared-module.module';
import { OportunidadesService } from 'src/app/services/oportunidades.service';
import { Oportunidade } from 'src/app/types/oportunidade';

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
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  yearsSelectFilter = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private oportunidades: OportunidadesService,
    private _liveAnnouncer: LiveAnnouncer,
    private formBuilder: FormBuilder,
  ){}

  ngOnInit(): void {
    // Carrega as oportunidades do banco
    this.loadOportunidades();

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

  openModalEditarOportunidade(element: any){

  }

  closeModalEditarOportunidade(){}

  onSubmitEditarOportunidade(){}
}
