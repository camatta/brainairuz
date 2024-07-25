import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';

import { SharedModule } from 'src/app/modules/shared-module/shared-module.module';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { MetasVendedoresService } from 'src/app/services/metasVendedores.service';
import { MetasEmpresaService } from 'src/app/services/metasEmpresa.service';
import { ComissoesService } from 'src/app/services/comissoes.service';
import { MetaEmpresa } from 'src/app/types/metaEmpresa';
import { MetaVendedor } from 'src/app/types/metaVendedor';

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
  constructor(
    private authService: AuthService,
    private usersService: UserService,
    private metasVendedoresService: MetasVendedoresService,
    private metasEmpresaService: MetasEmpresaService,
    private commissionsService: ComissoesService,
    private formBuilder: FormBuilder,
  ) {}

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
  metasEmpresa: any[] = [];
  metasIndividuais: any[] = [];
  metaIndividualRealizada: number = 0;
  metaEmpresaRealizada: number = 0;
  tabela: Meta[] = [];
  onLoad: boolean = false;

  filtroVendedor: string = "";
  filtroMes: string = "";
  filtroAno: string = "";

  // Verifica a permissão do usuário
  userPermission(): boolean {
    if(this.currentUser.accessLevel == "Administrador" || this.currentUser.name == "Valeria Queiroz"  || this.currentUser.name === 'Adriany Oliveira'){
      return true;
    }
    return false;
  }

  applyFilter(el: any){
    if(el.id == "filtroVendedor") {
      this.filtroVendedor = el.value;
    } else if(el.id == "filtroMes") {
      this.filtroMes = el.value;
    } else if(el.id == "filtroAno") {
      this.filtroAno = el.value;
    }
    this.objetoTabela(this.metasEmpresa, this.metasIndividuais, this.filtroMes, this.filtroAno, this.filtroVendedor);
  }

  ngOnInit(): void {
    // Carrega colunas para administradores
    if(this.userPermission()){
      this.displayedColumns = [
        'mes',
        'metaEmpresa',
        'metaRealizadaEmpresa',
        'metaIndividual',
        'metaRealizadaIndividual',
        'vendedor',
        'actions'
      ];

      let usuario: string = "adm";
      this.loadComissoes(usuario, "sem filtro", this.currentYear, "sem filtro");

    } else {
      let vendedor: string = this.currentUser.name;
      this.loadComissoes(vendedor, "sem filtro", this.currentYear);
    }
    
    // Carrega vendedores do time Comercial
    this.loadVendedores();

    // Carrega as metas do vendedor
    this.loadMetas();

    // Carrega os anos para inserir no input do filtro
    this.loadAnosMetas();
  }

  // MODAL de ação dos produtos
  showMessageAction(message: string) {
    const toast: HTMLElement = document.querySelector("#alert-actions");
    this.msgActions = message;
    setTimeout(() => toast.classList.add('show'), 700);
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // Método para carregar as metas da empresa
  loadMetasEmpresa(ano: string, vendedor?: string, mes?: string) {
    this.metasEmpresaService.getMetas(ano).subscribe(
      (data) => {
        this.metasEmpresa = data;
      }, (err) => {
        console.error(err);
      }
    )
  }

  loadAnosMetas() {
    this.metasVendedoresService.getMetas("adm", "", "", "").subscribe(
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

  loadVendedores() {
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
    );
  }

  objetoTabela(metasEmpresas: any[], metasIndividuais: any[], filtroMes: string, filtroAno: string, filtroVendedor: string) {
    this.tabela = [];
    
    // Crie um mapa para metas individuais
    const mapaMetasIndividuais = new Map();
    metasIndividuais.forEach((metaVendedor) => {
      const chave = `${metaVendedor.ano}-${metaVendedor.mes}`;
      if(!mapaMetasIndividuais.has(chave)) {
        mapaMetasIndividuais.set(chave, []);
      }
      mapaMetasIndividuais.get(chave).push(metaVendedor);
    });

    metasEmpresas.forEach((metaEmpresa: MetaEmpresa) => {
      const chave = `${metaEmpresa.ano}-${metaEmpresa.mes}`;
      const metasVendedores = mapaMetasIndividuais.get(chave) || [];

      if(metasVendedores.length > 0) {
        metasVendedores.forEach((metaVendedor: any) => {
          if((!filtroVendedor || metaVendedor.vendedor === filtroVendedor) &&
          (!filtroMes || metaVendedor.mes === filtroMes) &&
          (!filtroAno || metaVendedor.ano === filtroAno)) {
            const novaLinha = {
              _id: metaVendedor._id,
              vendedor: metaVendedor.vendedor,
              ano: metaEmpresa.ano,
              mes: metaEmpresa.mes,
              metaEmpresa: metaEmpresa.metaEmpresa,
              metaIndividual: metaVendedor.metaIndividual,
              metaIndividualRealizada: this.metaIndividualRealizada,
              metaEmpresaRealizada: this.metaEmpresaRealizada
            };
            this.tabela.push(novaLinha);
          }
        });
      } else {
        const novaLinha = {
          _id: metaEmpresa._id,
          vendedor: '', // Sem vendedor
          ano: metaEmpresa.ano,
          mes: metaEmpresa.mes,
          metaEmpresa: metaEmpresa.metaEmpresa,
          metaIndividual: 0,
          metaIndividualRealizada: this.metaIndividualRealizada,
          metaEmpresaRealizada: this.metaEmpresaRealizada
        };
        if ((!filtroMes || metaEmpresa.mes === filtroMes) && (!filtroAno || metaEmpresa.ano === filtroAno)) {
          this.tabela.push(novaLinha);
        }
      }
    });

    this.tabela.sort((a, b) => {
      return this.meses.indexOf(a.mes) - this.meses.indexOf(b.mes);
    });

    this.tabelaMetas = new MatTableDataSource(this.tabela);
  }

  loadMetasVendedores(usuario: string, mes: string, ano: string, vendedor?: string) {
    this.metasVendedoresService.getMetas(usuario, mes, ano, vendedor).subscribe(
      async (data) => {
        this.metasIndividuais = data;
      },
      async (error) => {
        console.error(error);
      }
    )
  }

  loadMetas(mes: string = "", ano: string = "", vendedor: string = "") {
    if(this.userPermission()){
      let usuario: string = "adm";

      // Carrega as metas da empresa
      this.loadMetasEmpresa(ano);

      // Carrega as metas dos vendedores
      this.loadMetasVendedores(usuario, mes, ano, vendedor);

      // Tempo para alterar os atributos metasEmpresa e metasIndividuais
      this.onLoad = true;
      setTimeout(() => {
        this.objetoTabela(this.metasEmpresa, this.metasIndividuais, mes, ano, vendedor);
        this.onLoad = false;
      }, 2000);

    } else {
      let vendedor: string = this.currentUser.name;

      // Carrega as metas da empresa
      this.loadMetasEmpresa(ano);

      // Carrega as metas dos vendedores
      this.loadMetasVendedores(vendedor, mes, ano);

      // Tempo para alterar os atributos metasEmpresa e metasIndividuais
      this.onLoad = true;
      setTimeout(() => {
        this.objetoTabela(this.metasEmpresa, this.metasIndividuais, vendedor, mes, ano);
        this.onLoad = false;
      }, 2000);
    }

  }

  loadComissoes(usuario: string, mes: string, ano: string, vendedor?: string) {
    this.commissionsService.getComissoes(usuario, mes, ano, vendedor).subscribe(
      async (data) => {
        data.forEach((comissao) => {
          this.metaIndividualRealizada += comissao.valorVendido;
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
    metaIndividual: [0, Validators.required]
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
      metaIndividual: [0, Validators.required]
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
        metaIndividual: this.formNovaMeta.get('metaIndividual').value,
      }

      this.metasVendedoresService.setMeta(novaMeta).subscribe(
        async (res) => {
          this.showMessageAction('Meta adicionada com sucesso');
          console.log(novaMeta);
          await this.loadMetas("", novaMeta.ano);
          this.tabelaMetas._updateChangeSubscription();
          this.closeModalNovaMeta();
        },
        async (error) => {
          console.log(novaMeta);
          console.error(`Erro ao inserir a meta: ${error}`);
          this.showMessageAction('ERRO ao criar a meta');
          this.tabelaMetas._updateChangeSubscription();
          this.closeModalNovaMeta();
        }
      );
    }

    this.formNovaMeta = this.formBuilder.group({
      vendedor: ['', Validators.required],
      ano: [this.currentYear, Validators.required],
      mes: ['', Validators.required],
      metaIndividual: [0, Validators.required]
    });
  }


  formEditarMeta = this.formBuilder.group({
    _id: ['', Validators.required],
    vendedor: ['', Validators.required],
    ano: ['', Validators.required],
    mes: ['', Validators.required],
    metaIndividual: [0, Validators.required]
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
      metaIndividual: element.metaIndividual
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
        metaIndividual: this.formEditarMeta.get('metaIndividual').value
      }

      this.metasVendedoresService.updateMeta(idMeta, metaEditada).subscribe(
        async (res) => {
          this.showMessageAction('Meta editada com sucesso');
          console.log(metaEditada);
          await this.loadMetas("", metaEditada.ano);
          this.tabelaMetas._updateChangeSubscription();
          this.closeModalEditarMeta();
        },
        async (error) => {
          console.error(`Erro ao editar a meta: ${error}`);
          this.showMessageAction('ERRO ao editar a meta');
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

    this.metasVendedoresService.deleteMeta(id).subscribe(
      async (res) => {
        this.showMessageAction('Meta excluída com sucesso');
        await this.loadMetas("", this.formDeletarMeta.get('ano').value);
        this.tabelaMetas._updateChangeSubscription();
        this.closeModalDeletarMeta();
      },
      async (error) => {
        console.error(`Erro ao excluir a meta selecionada: ${error}`);
        this.showMessageAction('ERRO ao excluir a meta selecionada');
        this.tabelaMetas._updateChangeSubscription();
        this.closeModalDeletarMeta();
      }
    );
  }
}
