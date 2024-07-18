import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';

import { SharedModule } from 'src/app/modules/shared-module/shared-module.module';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { MetasService } from 'src/app/services/metas.service';

type Meta = {
  _id: string;
  vendedor: string;
  ano: string;
  mes: string;
  metaEmpresa: number;
  metaEmpresaRealizada: number;
  metaIndividual: number;
  metaIndividualRealizada: number;
}

@Component({
  selector: 'app-tabela-metas',
  templateUrl: './tabela-metas.component.html',
  styleUrls: ['./tabela-metas.component.css'],
  standalone: true,
  imports: [ SharedModule ]
})

export class TabelaMetasComponent implements OnInit {
  displayedColumns: string[] = [
    'mes',
    'metaEmpresa',
    'metaRealizadaEmpresa',
    'metaIndividual',
    'metaRealizadaIndividual',
  ];
  tabelaMetas: MatTableDataSource<Meta> = new MatTableDataSource<Meta>([]);
  currentUser = this.authService.getUser();  // Traz os dados do usuário
  msgActions: string;
  filterYears: any[] = [];
  vendedores: any[] = [];
  newDate = new Date();
  currentYear = String(this.newDate.getFullYear());
  meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  userPermission(): boolean {
    if(this.currentUser.accessLevel == "Administrador" || this.currentUser.name == "Valeria Queiroz"  || this.currentUser.name === 'Adriany Oliveira'){
      return true;
    }
    return false;
  }

  // Método para o filtro
  submitFormFilter() {
    let yearSelect: HTMLSelectElement = document.querySelector("#filtroAno");
    let vendedorSelect: HTMLSelectElement = document.querySelector("#filtroVendedor");

    let year: string = yearSelect.selectedOptions[0].value;
    let vendedor: string;

    if(vendedorSelect){
      vendedor = vendedorSelect.selectedOptions[0].value;
    } else {
      vendedor = this.currentUser.name;
    }

    this.loadMetas(vendedor, year);
  }

  constructor(
    private authService: AuthService,
    private usersService: UserService,
    private metasService: MetasService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    if(this.userPermission()){
      this.displayedColumns = [
        'mes',
        'metaEmpresa',
        'metaRealizadaEmpresa',
        'metaIndividual',
        'metaRealizadaIndividual',
        'actions'
      ]; 
    }
    
    // Carrega vendedores do time Comercial
    this.usersService.getUsers().subscribe(
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

    // Carrega as metas do vendedor
    this.loadMetas();

    // Carrega os anos para inserir no input do filtro
    this.loadAnosMetas("Kyrsten Júnior", undefined);
  }

  // MODAL de ação dos produtos
  showMessageAction(message: string) {
    const toast: HTMLElement = document.querySelector("#alert-actions");
    this.msgActions = message;
    setTimeout(() => toast.classList.add('show'), 700);
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  loadMetas(vendedor: string = this.currentUser.name, ano: string = this.currentYear) {
    this.metasService.getMetas(vendedor, ano).subscribe(
      async (data) => {
        this.tabelaMetas = new MatTableDataSource(data);
      },
      async (error) => {
        console.error(error);
      }
    )
  }

  loadAnosMetas(vendedor: string, ano: any) {
    this.metasService.getMetas(vendedor, ano).subscribe(
      async (data) => {
        data.forEach((meta) => {
          const ano: string = meta.ano;
          if(!this.filterYears.includes(ano)){
            this.filterYears.push(ano);
          }
        })
      },
      async (error) => {
        console.error(error);
      }
    )
  }


  formNovaMeta = this.formBuilder.group({
    vendedor: ['', Validators.required],
    ano: [this.currentYear, Validators.required],
    mes: ['', Validators.required],
    metaEmpresa: [0, Validators.required],
    metaRealizadaEmpresa: [0, Validators.required],
    metaIndividual: [0, Validators.required],
    metaRealizadaIndividual: [0, Validators.required]
  });

  openModalNovaMeta() {
    const modal = document.getElementById("modalNew");
    const bgModal = document.getElementById("bg-modal");

    if(modal != null){
      modal.style.display = "block";
      bgModal.style.display = "block";
      modal.classList.add("show");
    }
  }

  closeModalNovaMeta() {
    const modal = document.getElementById("modalNew");
    const bgModal = document.getElementById("bg-modal");

    if(modal != null){
      modal.style.display = "none";
      bgModal.style.display = "none";
      modal.classList.remove("show");
    }

    this.formNovaMeta = this.formBuilder.group({
      vendedor: ['', Validators.required],
      ano: [this.currentYear, Validators.required],
      mes: ['', Validators.required],
      metaEmpresa: [0, Validators.required],
      metaRealizadaEmpresa: [0, Validators.required],
      metaIndividual: [0, Validators.required],
      metaRealizadaIndividual: [0, Validators.required]
    });
  }

  submitNovaMeta() {
    this.formNovaMeta.updateValueAndValidity();
    const formNovaMetaStatus: string = this.formNovaMeta.status;

    if(formNovaMetaStatus !== "INVALID") {
      const novaMeta = {
        vendedor: this.formNovaMeta.get('vendedor').value,
        ano: this.formNovaMeta.get('ano').value,
        mes: this.formNovaMeta.get('mes').value,
        metaEmpresa: this.formNovaMeta.get('metaEmpresa').value,
        metaRealizadaEmpresa: this.formNovaMeta.get('metaRealizadaEmpresa').value,
        metaIndividual: this.formNovaMeta.get('metaIndividual').value,
        metaRealizadaIndividual: this.formNovaMeta.get('metaRealizadaIndividual').value
      }

      this.metasService.setMeta(novaMeta).subscribe(
        async (res) => {
          this.showMessageAction('Meta adicionada com sucesso');
          console.log(novaMeta);
          await this.submitFormFilter();
          this.tabelaMetas._updateChangeSubscription();
          this.closeModalNovaMeta();
        },
        async (error) => {
          console.log(novaMeta);
          console.error(`Erro ao inserir a meta: ${error}`);
          this.showMessageAction('ERRO ao criar a meta');
          await this.submitFormFilter();
          this.tabelaMetas._updateChangeSubscription();
          this.closeModalNovaMeta();
        }
      );
    }

    this.formNovaMeta = this.formBuilder.group({
      vendedor: ['', Validators.required],
      ano: [this.currentYear, Validators.required],
      mes: ['', Validators.required],
      metaEmpresa: [0, Validators.required],
      metaRealizadaEmpresa: [0, Validators.required],
      metaIndividual: [0, Validators.required],
      metaRealizadaIndividual: [0, Validators.required]
    });
  }


  formEditarMeta = this.formBuilder.group({
    _id: ['', Validators.required],
    vendedor: ['', Validators.required],
    ano: ['', Validators.required],
    mes: ['', Validators.required],
    metaEmpresa: [0, Validators.required],
    metaRealizadaEmpresa: [0, Validators.required],
    metaIndividual: [0, Validators.required],
    metaRealizadaIndividual: [0, Validators.required]
  });

  openModalEditarMeta(element: any) {
    const modal = document.getElementById("modalEdit");
    const bgModal = document.getElementById("bg-modal");

    // Busca os valores da linha e insere nos inputs
    this.formEditarMeta.patchValue({
      _id: element._id,
      vendedor: element.vendedor,
      mes: element.mes,
      ano: element.ano,
      metaEmpresa: element.metaEmpresa,
      metaRealizadaEmpresa: element.metaRealizadaEmpresa,
      metaIndividual: element.metaIndividual,
      metaRealizadaIndividual: element.metaRealizadaIndividual
    });

    if(modal != null){
      modal.style.display = "block";
      bgModal.style.display = "block";
      modal.classList.add("show");
    };
  }

  closeModalEditarMeta() {
    const modal = document.getElementById("modalEdit");
    const bgModal = document.getElementById("bg-modal");
    if(modal != null){
      modal.style.display = "none";
      bgModal.style.display = "none";
      modal.classList.remove("show");
    }
  }

  submitEditarMeta() {
    this.formEditarMeta.updateValueAndValidity();
    const formEditarMetaStatus: string = this.formEditarMeta.status;

    if(formEditarMetaStatus !== "INVALID") {
      const idMeta = this.formEditarMeta.get('_id').value;
      const metaEditada = {
        vendedor: this.formEditarMeta.get('vendedor').value,
        mes: this.formEditarMeta.get('mes').value,
        ano: this.formEditarMeta.get('ano').value,
        metaEmpresa: this.formEditarMeta.get('metaEmpresa').value,
        metaRealizadaEmpresa: this.formEditarMeta.get('metaRealizadaEmpresa').value,
        metaIndividual: this.formEditarMeta.get('metaIndividual').value,
        metaRealizadaIndividual: this.formEditarMeta.get('metaRealizadaIndividual').value
      }

      this.metasService.updateMeta(idMeta, metaEditada).subscribe(
        async (res) => {
          this.showMessageAction('Meta editada com sucesso');
          console.log(metaEditada);
          await this.submitFormFilter();
          this.tabelaMetas._updateChangeSubscription();
          this.closeModalEditarMeta();
        },
        async (error) => {
          console.log(metaEditada);
          console.error(`Erro ao editar a meta: ${error}`);
          this.showMessageAction('ERRO ao editar a meta');
          await this.submitFormFilter();
          this.tabelaMetas._updateChangeSubscription();
          this.closeModalEditarMeta();
        }
      );
    }
  }


  formDeletarMeta = this.formBuilder.group({
    _id: ['', Validators.required],
    vendedor: ['', Validators.required],
    ano: ['', Validators.required],
    mes: ['', Validators.required]
  })

  openModalDeletarMeta(element: any) {
    const modal = document.getElementById("modalDeletar");
    const bgModal = document.getElementById("bg-modal");
    if(modal != null){
      modal.style.display = "block";
      bgModal.style.display = "block";
      modal.classList.add("show");
    }

    // Busca os valores da linha
    this.formDeletarMeta.patchValue({
      _id: element._id,
      vendedor: element.vendedor,
      ano: element.ano,
      mes: element.mes
    })
  }

  closeModalDeletarMeta() {
    const modal = document.getElementById("modalDeletar");
    const bgModal = document.getElementById("bg-modal");
    if(modal != null){
      modal.style.display = "none";
      bgModal.style.display = "none";
      modal.classList.remove("show");
    }
  }

  submitDeletarMeta() {
    const id: string = this.formDeletarMeta.get('_id').value;

    this.metasService.deleteMeta(id).subscribe(
      async (res) => {
        this.showMessageAction('Meta excluída com sucesso');
        await this.submitFormFilter();
        this.tabelaMetas._updateChangeSubscription();
        this.closeModalDeletarMeta();
      },
      async (error) => {
        console.error(`Erro ao excluir a meta selecionada: ${error}`);
        this.showMessageAction('ERRO ao excluir a meta selecionada');
        await this.submitFormFilter();
        this.tabelaMetas._updateChangeSubscription();
        this.closeModalDeletarMeta();
      }
    );
  }
}
