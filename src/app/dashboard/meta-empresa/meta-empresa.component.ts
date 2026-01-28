import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';

import { SharedModule } from 'src/app/modules/shared-module/shared-module.module';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { MetasEmpresaService } from 'src/app/services/metasEmpresa.service';

import { MetaEmpresa } from 'src/app/types/metaEmpresa';

@Component({
  selector: 'app-meta-empresa',
  templateUrl: './meta-empresa.component.html',
  styleUrls: ['./meta-empresa.component.css'],
  standalone: true,
  imports: [ SharedModule ]
})

export class MetaEmpresaComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private metasEmpresaService: MetasEmpresaService,
    private formBuilder: FormBuilder,
  ) {}

  displayedColumns: string[] = ['mes', 'metaEmpresa'];
  tabelaMetas: MatTableDataSource<MetaEmpresa> = new MatTableDataSource<MetaEmpresa>([]);
  currentUser = this.authService.getUser();  // Traz os dados do usuário
  msgActions: string;
  filterYears: any[] = [];
  newDate = new Date();
  currentYear = String(this.newDate.getFullYear());
  meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  metaAnual: number = 0;

  userPermission(): boolean {
    if(this.currentUser.accessLevel == "Administrador" || this.currentUser.name == "Valeria Queiroz"  || this.currentUser.name === 'Adriany Oliveira' || this.currentUser.name === 'Hugo Brito'){
      return true;
    }
    return false;
  }

  // Método para o filtro
  submitFormFilter() {
    let selectAno: HTMLSelectElement = document.querySelector("#filtroAno");
    let ano: string = selectAno.selectedOptions[0].value;

    this.loadMetas(ano);
  }


  ngOnInit(): void {
    if(this.userPermission()) {
      this.displayedColumns = [
        'mes',
        'metaEmpresa',
        'actions'
      ];
    }
    // Carrega as metas do vendedor
    this.loadMetas();

    // Carrega os anos para inserir no input do filtro
    this.loadAnosMetas();
  }

  // MODAL de ação das metas
  showMessageAction(message: string) {
    const toast: HTMLElement = document.querySelector("#alert-actions");
    this.msgActions = message;
    setTimeout(() => toast.classList.add('show'), 700);
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  loadMetas(ano: string = this.currentYear) {
    this.metasEmpresaService.getMetas(ano).subscribe(
      async (data) => {
        const tabelaOrdenadaMes = data.sort((a, b) => {
          return this.meses.indexOf(a.mes) - this.meses.indexOf(b.mes);
        });
        this.tabelaMetas = new MatTableDataSource(tabelaOrdenadaMes);
        this.tabelaMetas.data.forEach((meta) => {
          this.metaAnual += meta.metaEmpresa;
        })
      },
      async (error) => {
        console.error(error);
      }
    )
  }

  loadAnosMetas() {
      this.metasEmpresaService.getMetas("").subscribe(
        async (data) => {
          console.log(data)
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
    ano: [this.currentYear, Validators.required],
    mes: ['', Validators.required],
    metaEmpresa: [0, Validators.required]
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
      ano: [this.currentYear, Validators.required],
      mes: ['', Validators.required],
      metaEmpresa: [0, Validators.required]
    });
  }

  submitNovaMeta() {
    this.formNovaMeta.updateValueAndValidity();
    const formNovaMetaStatus: string = this.formNovaMeta.status;

    if(formNovaMetaStatus !== "INVALID") {
      const novaMeta = {
        ano: this.formNovaMeta.get('ano').value,
        mes: this.formNovaMeta.get('mes').value,
        metaEmpresa: this.formNovaMeta.get('metaEmpresa').value
      }

      var verificaMeta = false;

      this.tabelaMetas.data.map((meta) => {
        if(meta.ano && meta.mes) {
          if(novaMeta.ano.includes(meta.ano) && novaMeta.mes.includes(meta.mes)){
            verificaMeta = true;
          }
        }
      })

      if(!verificaMeta) {
        this.metasEmpresaService.setMeta(novaMeta).subscribe(
          async (res) => {
            this.showMessageAction('Meta adicionada com sucesso');
            console.log(novaMeta);
            await this.loadMetas(novaMeta.ano);
            await this.loadAnosMetas();
            this.tabelaMetas._updateChangeSubscription();
            this.closeModalNovaMeta();
          },
          async (error) => {
            console.log(novaMeta);
            console.error(`Erro ao inserir a meta: ${error}`);
            this.showMessageAction('ERRO ao criar a meta');
            await this.loadMetas(novaMeta.ano);
            await this.loadAnosMetas();
            this.tabelaMetas._updateChangeSubscription();
            this.closeModalNovaMeta();
          }
        );
      } else {
        this.showMessageAction('Já possui uma meta para este mês e ano!');
        this.closeModalNovaMeta();
      }
    }

    this.formNovaMeta = this.formBuilder.group({
      ano: [this.currentYear, Validators.required],
      mes: ['', Validators.required],
      metaEmpresa: [0, Validators.required]
    });
  }


  formEditarMeta = this.formBuilder.group({
    _id: ['', Validators.required],
    ano: ['', Validators.required],
    mes: ['', Validators.required],
    metaEmpresa: [0, Validators.required]
  });

  openModalEditarMeta(element: any) {
    const modal = document.getElementById("modalEdit");
    const bgModal = document.getElementById("bg-modal");

    // Busca os valores da linha e insere nos inputs
    this.formEditarMeta.patchValue({
      _id: element._id,
      mes: element.mes,
      ano: element.ano,
      metaEmpresa: element.metaEmpresa
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
        mes: this.formEditarMeta.get('mes').value,
        ano: this.formEditarMeta.get('ano').value,
        metaEmpresa: this.formEditarMeta.get('metaEmpresa').value
      }

      this.metasEmpresaService.updateMeta(idMeta, metaEditada).subscribe(
        async (res) => {
          this.showMessageAction('Meta editada com sucesso');
          console.log(metaEditada);
          await this.loadMetas(metaEditada.ano);
          await this.loadAnosMetas();
          this.tabelaMetas._updateChangeSubscription();
          this.closeModalEditarMeta();
        },
        async (error) => {
          console.log(metaEditada);
          console.error(`Erro ao editar a meta: ${error}`);
          this.showMessageAction('ERRO ao editar a meta');
          await this.loadMetas(metaEditada.ano);
          await this.loadAnosMetas();
          this.tabelaMetas._updateChangeSubscription();
          this.closeModalEditarMeta();
        }
      );
    }
  }


  formDeletarMeta = this.formBuilder.group({
    _id: ['', Validators.required],
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
    const meta = {
      ano: this.formDeletarMeta.get('ano').value,
      mes: this.formDeletarMeta.get('mes').value
    }

    this.metasEmpresaService.deleteMeta(id).subscribe(
      async (res) => {
        this.showMessageAction('Meta excluída com sucesso');
        await this.loadMetas(meta.ano);
        await this.loadAnosMetas();
        this.tabelaMetas._updateChangeSubscription();
        this.closeModalDeletarMeta();
      },
      async (error) => {
        console.error(`Erro ao excluir a meta selecionada: ${error}`);
        this.showMessageAction('ERRO ao excluir a meta selecionada');
        await this.loadMetas(meta.ano);
        await this.loadAnosMetas();
        this.tabelaMetas._updateChangeSubscription();
        this.closeModalDeletarMeta();
      }
    );
  }
}
