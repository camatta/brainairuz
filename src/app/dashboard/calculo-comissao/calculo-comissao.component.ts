import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { SharedModule } from 'src/app/modules/shared-module/shared-module.module';

import { Produtos } from '../tabela-valores/interfaceProdutos';
import { Comissao } from 'src/app/types/comissao';

import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { MixProdutosService } from 'src/app/services/mixProdutos.service';
import { ProductsService } from 'src/app/services/products.service';
import { ComissoesService } from 'src/app/services/comissoes.service';
import { MetasVendedoresService } from 'src/app/services/metasVendedores.service';
import { MetasEmpresaService } from 'src/app/services/metasEmpresa.service';
import { DataService } from 'src/app/services/dataService.service';

interface vendaType {
  ano: string;
  dataCriacaoComissao: Date;
  dataVenda: string;
  grupo_markup: number;
  markup: number;
  mes: string;
  mixProdutos: string;
  multiplicador: number;
  status: string;
  tipoProduto: string;
  valorBase: number;
  valorVendido: number;
  vendaAvulsa: number;
  vendedor: string;
}

interface UploadEvent extends Event {
  file: File;
}

@Component({
  selector: 'app-calculo-comissao',
  templateUrl: './calculo-comissao.component.html',
  styleUrls: ['./calculo-comissao.component.css'],
  standalone: true,
  imports: [ SharedModule ]
})

export class CalculoComissaoComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private mixProdutosService: MixProdutosService,
    private _liveAnnouncer: LiveAnnouncer,
    private formBuilder: FormBuilder,
    private comissoesService: ComissoesService,
    private productService: ProductsService,
    private metasVendedoresService: MetasVendedoresService,
    private metasEmpresaService: MetasEmpresaService,
    private dataService: DataService, 
    private router: Router,
  ){}

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'cliente',
    'status',
    'dataVenda',
    'mixProdutos',
    'tipoProduto',
    'multiplicador',
    'markup',
    'vendaAvulsa',
    'valorBase',
    'valorVendido',
    'actions'
  ];
  tabelaVendas: MatTableDataSource<Comissao> = new MatTableDataSource<Comissao>([]);
  msgActions: string;
  mixProdutos: any = [];
  produtos: Produtos[] = [];
  produtosFiltrados: any[] = [];
  mesFiltro: string = null;
  vendedores: any[] = [];
  currentUser = this.authService.getUser();  // Traz os dados do usuário logado
  date = new Date();
  currentYear = String(this.date.getFullYear());
  metaRealizadaEmpresa: number = 0;

  /* INDICADORES GERADOS A PARTIR DAS VENDAS */
  vendasTotal: number = 0; // Soma de todos os Valores Vendidos
  fatorMultiplicador: number = 0.025; // Entrada de INPUT
  metaTotalMesVendedor: number = 0; // Vendas total / Meta individual que vem da tabela de metas
  metaVendedor: number = 0; // Regra feita dentro do método loadMetas para um limite na % de comissão
  qualidade: number = 0; // Se valorTotal == 0 então qualidade = 0 senão (valorTotal * 2) / soma(valoresBase)
  metaTotalMesEmpresa: number = 0; // Meta Realizada da Empresa / Meta Total da Empresa (todos os valores vem da tabela de metas)
  metaEmpresa: number = 0; // Regra feita dentro do método loadMetas para um limite na % de comissão
  mix: number = 0.5; // Se tiver pelo menos 1 produto MKT e 1 produto TEC, mix = 1 senão mix = 0,5
  comissaoFinal: number = 0; // (100 * vendasTotal * mix * qualidade * metaEmpresa * metaVendedor)
  valorComissao: number = 0; // (vendasTotal * comissaoFinal) / 100) - (vendasTotal * comissaoFinal) / 100) * 0.16
  valorBaseTotal: number = 0; // Valor Base vem da tabela de valores dos produtos

  /* Variáveis e métodos de controle de front */
  onLoadComissions: boolean = false;
  grupoMarkup: number;
  maxMarkup: number;
  minMarkup: number;
  onLoadComission: boolean = false;

  userPermission(): boolean {
    if(this.currentUser.accessLevel == "Administrador" || this.currentUser.name == "Valeria Queiroz" || this.currentUser.name === 'Adriany Oliveira'){
      return true;
    }
    return false;
  }

  mostrarBotaoEditar: boolean = true;
  mostrarBotaoEnviar: boolean = false;
  formFatorMultiplicador = this.formBuilder.group({
    fatorMultiplicador: [{ value: 0.025, disabled: true }]
  });

  editarFator(){
    this.mostrarBotaoEditar = false;
    this.mostrarBotaoEnviar = true;
    this.formFatorMultiplicador.get('fatorMultiplicador').enable();
    let input = document.getElementById("fatorMultiplicador");
    input.focus();
  }

  enviarFator(){
    this.mostrarBotaoEditar = true;
    this.mostrarBotaoEnviar = false;
    this.formFatorMultiplicador.get('fatorMultiplicador').disable();
    let input = document.getElementById("fatorMultiplicador");
    input.blur();
    this.fatorMultiplicador = this.formFatorMultiplicador.get('fatorMultiplicador').value;
    this.loadComissoes();
  }
  
  mixProdutosValidate: boolean = true;

  defineMixProdutosValidate() {
    const modalNew = document.getElementById("modalNew");
    const modalEdit = document.getElementById("modalEdit");
    let mixProdutosNovaVenda = this.formNovaVenda.get('mixProdutos').value;
    let mixProdutosEditarVenda = this.formEditarVenda.get('mixProdutos').value;

    if(modalNew.style.display == "block") {
      if(mixProdutosNovaVenda == 'Help Suporte A' || mixProdutosNovaVenda == ''){
        this.mixProdutosValidate = false;
      } else {
        this.mixProdutosValidate = true;
      }
    } else if(modalEdit.style.display == "block") {
      if(mixProdutosEditarVenda == 'Help Suporte A' || mixProdutosEditarVenda == ''){
        this.mixProdutosValidate = false;
      } else {
        this.mixProdutosValidate = true;
      }
    } else {
      this.mixProdutosValidate = false;
    }
  }

  redirectToMixProdutos(){
    this.router.navigate(['/dashboard/mix-produtos']);
  }

  yearsSelectFilter: string[] = []; // Array povoado pelo método loadComissoes()
  
  /* Fim Variáveis e métodos de controle de front */


  ngOnInit(): void {
    // Verifica a permissão do usuário para mostrar itens de edição
    if(this.userPermission()) {
      this.displayedColumns = [
        'cliente',
        'vendedor',
        'status',
        'dataVenda',
        'mixProdutos',
        'tipoProduto',
        'multiplicador',
        'markup',
        'vendaAvulsa',
        'valorBase',
        'valorVendido',
        'actions'
      ]
    }

    // Carrega todos os mix de produtos e insere nos modais de nova/edição de comissão
    this.loadMixesDeProdutos();

    // Carrega todos os produtos
    this.loadProdutos();

    // TESTE
    this.loadVendasTotais();

    // Carrega todos os vendedores para inserir no input do filtro do front
    this.loadVendedores();

    // Carrega todos os anos das comissões para inserir no select do filtro
    this.loadAnosComissoes();

    // Carrega todas as comissões
    this.loadComissoes();

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

  // Carrega todos os anos das comissões para inserir no select do filtro
  loadAnosComissoes() {
    this.comissoesService.getComissoes("adm", "sem filtro", "sem filtro", "sem filtro").subscribe(
      async (data) => {
        data.forEach((venda) => {
          // BUSCA OS ANOS PARA INSERIR NO SELECT DO FRONT
          const ano = venda.ano;
          if(!this.yearsSelectFilter.includes(ano)){
            this.yearsSelectFilter.push(ano);
          } 
        })
      }
    )
  }

  // Carrega todos os vendedores
  loadVendedores() {
    // Carrega vendedores do time Comercial
    this.userService.getUsers().subscribe(
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

  // Carrega todos os mix de produtos e insere nos modais de nova/edição de comissão
  loadMixesDeProdutos() {
    this.mixProdutosService.getMixProdutos().subscribe(
      async (data) => {
        data.forEach(result => {
          this.mixProdutos.push(result);
        });
      }, (err) => {
        console.error(err)
      }
    );
  }

  // Carrega todos os produtos
  loadProdutos() {
    this.productService.getProducts().subscribe(
      async (data) => {
        this.produtos = data;
        this.produtosFiltrados = this.produtos;
      }, (err) => {
        console.error(err)
      }
    );
  }

  // Verifica os Mix de produtos para definir o valor Mix do Mês
  verifyProductsMix(data: any) {
    const haveProductMixTechnology = data.some((produto: any) => produto.mixProdutos === "Tecnologia");
    const haveProductMixMarketing = data.some((produto: any) => produto.mixProdutos === "Marketing");
    return haveProductMixTechnology && haveProductMixMarketing;
  }

  // Verifica o valor digitado no input number do Markup
  controlMarkupInputForm: boolean = true;
  verifyValueMarkup(element: any) {
    let valueInput = element.target.value;
    
    if(valueInput < this.minMarkup) { 
      this.controlMarkupInputForm = false;
      return;
    }

    this.controlMarkupInputForm = true;

    // inserir aqui uma validação para que, quando eu for editar uma comissão, caso eu tenha uma imagem e não seja mais necessária, precisa removê-la de acordo com a validação do markup
    this.imageEmailMarkupApproval = null;
    this.urlPreviewImage = null;

    this.formEditarVenda.patchValue({ imageEmailMarkupApproval: element.imageEmailMarkupApproval });
  }

  // Função para filtrar comissões por vendedor, mês e/ou ano
  submitFormFilter() {
    let yearSelect: HTMLSelectElement = document.querySelector("#years");
    let monthSelect: HTMLSelectElement = document.querySelector("#months");
    let vendedorSelect: HTMLSelectElement = document.querySelector("#vendedor");

    let year: string = yearSelect.selectedOptions[0].value;
    let month: string = monthSelect.selectedOptions[0].value;
    let vendedor: string;

    if(vendedorSelect){
      vendedor = vendedorSelect.selectedOptions[0].value;
    } else {
      vendedor = this.currentUser.name;
    }

    this.loadComissoes(month, year, vendedor);
    this.loadVendasTotais(month, year);
  }

  // Carrega as comissões de acordo com o filtro
  loadComissoes(filterMonth: string = "Janeiro", filterYear: string = this.currentYear, vendedor: string = "sem filtro") {
    if(this.userPermission()) {
      let usuario: string = "adm";

      // Carrega as comissões
      this.comissoesService.getComissoes(usuario, filterMonth, filterYear, vendedor).subscribe(
        async (data) => {
          if(data.length > 0) {
            this.loadMetas(usuario, filterYear, filterMonth);
            this.generateTableAndCommissions(data);
          } else {
            let zerar: boolean = true;
            this.loadMetas(usuario, filterYear, filterMonth, zerar);
            this.generateTableAndCommissions(data);
          }
        }, (err) => {
          console.error(err);
        }
      );
    } else {
      let vendedor: string = this.currentUser.name;
      this.comissoesService.getComissoes(vendedor, filterMonth, filterYear).subscribe(
        async (data) => {
          this.loadMetas(vendedor, filterYear, filterMonth);
          console.log(data)
          this.generateTableAndCommissions(data);
        }, (err) => {
          console.error(err);
        }
      );
    }
  }

  loadVendasTotais(filterMonth: string = "Janeiro", filterYear: string = this.currentYear){
    this.comissoesService.getComissoes("adm", filterMonth, filterYear).subscribe(
      async (data) => {
        this.metaRealizadaEmpresa = 0;
        data.map((venda) => {
          this.metaRealizadaEmpresa += venda.valorVendido;
        });
      }, async (error) => {
        console.error(error);
      }
    )
  }

  // Carrega as comissões de acordo com o filtro
  loadMetas(vendedor: string, filterYear: string = this.currentYear, filterMonth: string, zerar?: boolean) {
    // Carrega as metas do mês selecionado
    if(vendedor !== "sem filtro") {
      this.metasVendedoresService.getMetas(vendedor, filterMonth, filterYear).subscribe(
        async (data) => {
          if(data.length > 0) {
            if(!zerar) {
              data.map((meta) => {
                if(meta.mes == filterMonth) {
                  // Fórmulas para Metas Gerais o Mês
                  this.metaTotalMesVendedor = Number((this.vendasTotal / meta.metaIndividual).toFixed(2));
                  
                  if(Number.isNaN(this.metaTotalMesVendedor) || this.metaTotalMesVendedor == Infinity) {
                    this.metaTotalMesVendedor = 0;
                  }
                }
              })
            } else {
              this.metaTotalMesVendedor = 0;
              this.metaVendedor = 0;
            }
          } else {
            this.metaTotalMesVendedor = 0;
            this.metaVendedor = 0;
          }
        }, async (error) => {
          console.error(error);
        }
      );
      this.metasEmpresaService.getMetas(filterYear, filterMonth).subscribe(
        async (data) => {
          if(data.length > 0) {
            if(!zerar) {
              data.map((meta) => {
                if(meta.mes == filterMonth) {
                  // Fórmulas para Metas Gerais o Mês
                  this.metaTotalMesEmpresa = Number((this.metaRealizadaEmpresa / meta.metaEmpresa).toFixed(2));

                  if(Number.isNaN(this.metaTotalMesEmpresa) || this.metaTotalMesEmpresa == Infinity) {
                    this.metaTotalMesEmpresa = 0;
                  }
  
                  // Fórmula para Meta do Vendedor
                  if(this.metaTotalMesVendedor >= 2 && this.metaTotalMesEmpresa >= 1){ // o 2 é 200% e o 1 é 100%
                    this.metaVendedor = 1.2;
                  } else if(this.metaTotalMesVendedor > 1 && this.metaTotalMesEmpresa >= 1) {
                    this.metaVendedor = 1.1;
                  } else if(this.metaTotalMesVendedor >= 1) {
                    this.metaVendedor = 1;
                  } else {
                    this.metaVendedor = Number(this.metaTotalMesVendedor.toFixed(2));
                  }
  
                  // Fórmula para Meta Empresa
                  if(this.metaTotalMesEmpresa > 1){
                    this.metaEmpresa = 1;
                  } else {
                    this.metaEmpresa = this.metaTotalMesEmpresa;
                  }
                }
              })
            } else {
              this.metaTotalMesEmpresa = 0;
              this.metaEmpresa = 0;
            }
          } else {
            this.metaTotalMesEmpresa = 0;
            this.metaEmpresa = 0;
          }
        }, async (error) => {
          console.error(error);
        }
      );
    }

  }

  // Cria a tabela e faz o cálculo das comissões de acordo com o método loadComissoes
  generateTableAndCommissions(data: any) {
    if(data.length > 0) {
      this.tabelaVendas = new MatTableDataSource<Comissao>(data);

      let somaVendas: number = 0;
      this.valorBaseTotal = 0;
  
      data.map((venda: vendaType) => {
        // VENDAS TOTAL
        if(venda.valorVendido) {
          somaVendas += Number(venda.valorVendido);
          this.vendasTotal = somaVendas;
        }
  
        // VALOR BASE
        if(venda.valorBase) {
          this.valorBaseTotal += venda.valorBase;
        }
        // this.valorBaseTotal < somaValoresBase ? this.valorBaseTotal = somaValoresBase : this.valorBaseTotal;
  
        // QUALIDADE
        if(this.vendasTotal == 0) {
          this.qualidade = this.vendasTotal;
        } else {
          this.qualidade = Number(((this.vendasTotal * 2) / this.valorBaseTotal).toFixed(2));
          if(Number.isNaN(this.qualidade) || this.qualidade == Infinity){
            this.qualidade = 0;
          }
        }
  
        // MIX
        this.verifyProductsMix(data);
        if(this.verifyProductsMix(data)) {
          this.mix == 0.5 ? this.mix = 1 : this.mix = 1;
        } else {
          this.mix == 1 ? this.mix = 0.5 : this.mix = 0.5;
        }
  
        this.onLoadComissions = true;
        setTimeout(() => { // Usei o timeout por que as metas estavam demorando para retornar e afetando o cálculo da comissão
          // COMISSÃO FINAL
          // Se (100 * vendasTotal * mix * qualidade * metaEmpresa * metaVendedor) >= 6,2 então comissaoFinal = 6,2 senão
          // comissaoFinal = (100 * vendasTotal * mix * qualidade * metaEmpresa * metaVendedor)
          let calcComissaoFinal = Number((100 * this.fatorMultiplicador * this.mix * this.qualidade * this.metaEmpresa * this.metaVendedor).toFixed(2));
          calcComissaoFinal >= 6.2 ? this.comissaoFinal = 6.2 : this.comissaoFinal = calcComissaoFinal;
  
          // R$ COMISSÃO
          this.valorComissao = Number((((this.vendasTotal * this.comissaoFinal) / 100) - (((this.vendasTotal * this.comissaoFinal) / 100) * 0.16)).toFixed(2));
          this.onLoadComissions = false;
        }, 5000);
  
      });
    } else {
      this.tabelaVendas = new MatTableDataSource<Comissao>(data);
      this.vendasTotal = 0;
      this.valorBaseTotal = 0;
      this.qualidade = 0;
      this.mix = 0.5;
      this.comissaoFinal = 0;
      this.valorComissao = 0;
    }

  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // Função para fazer a busca dentro do input "Produto vendido"
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.produtosFiltrados = this.produtos.filter(item => item.produto.toLowerCase().includes(filterValue.toLowerCase()));
  }

  // MODAL de ação dos produtos
  showMessageAction(message: string) {
    const toast: HTMLElement = document.querySelector("#alert-actions");
    this.msgActions = message;
    setTimeout(() => toast.classList.add('show'), 700);
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // Função que define o mês da venda de acordo com a data passada pelo cliente
  defineMes(mes: string) {
    switch(mes) {
      case "01":
        return "Janeiro";
      case "02":
        return "Fevereiro";
      case "03":
        return "Março";
      case "04":
        return "Abril";
      case "05":
        return "Maio";
      case "06":
        return "Junho";
      case "07":
        return "Julho";
      case "08":
        return "Agosto";
      case "09":
        return "Setembro";
      case "10":
        return "Outubro";
      case "11":
        return "Novembro";
      case "12":
        return "Dezembro";
      default:
        return "Erro no mês enviado";
    }
  }

  // Método para verificar se a comissão está na data vigente
  verificaDataVigente(dataInput: Date): boolean {
    // Validação da data de lançamento da comissão
    const { startDate, endDate } = this.dataService.getCommissionRange(this.date);
    
    if (dataInput >= startDate && dataInput <= endDate) {
      return true;
    } else {
      return false;
    }
  }

  // Método para verificar se o markup usado está dentro do range
  
  // CRIAR Comissão
  imageEmailMarkupApproval: File;
  urlPreviewImage: string;
  onUploadImageEmailMarkupApproval(e: any){
    if(e.target.files && e.target.files[0]) {
      this.imageEmailMarkupApproval = e.target.files[0];
      this.urlPreviewImage = URL.createObjectURL(this.imageEmailMarkupApproval);
      this.controlMarkupInputForm = true;
    } else {
      console.log("Erro ao subir a imagem");
    }
  }

  openModalNovaVenda(){
    const modal = document.getElementById("modalNew");
    const bgModal = document.getElementById("bg-modal");

    if(modal != null){
      modal.style.display = "block";
      bgModal.style.display = "block";
      modal.classList.add("show");
    }
  }

  closeModalNovaVenda() {
    const modal = document.getElementById("modalNew");
    const bgModal = document.getElementById("bg-modal");

    if(modal != null){
      modal.style.display = "none";
      bgModal.style.display = "none";
      modal.classList.remove("show");
    }

    this.formNovaVenda = this.formBuilder.group({
      dataVenda: ['', Validators.required],
      status: ['Aguardando Aprovação', Validators.required],
      vendedor: [this.currentUser, Validators.required],
      nomeCliente: ['', Validators.required],
      mixProdutos: ['', Validators.required],
      produtoVendido: [''], // Verificar validação
      multiplicador: [''], // Verificar validação
      tecnologia_servico: [''], // Verificar validação
      markup: [0, Validators.required],
      vendaAvulsa: [0, Validators.required],
      valorBase: ['']
    });

    this.urlPreviewImage = null;
    this.minMarkup = null;
    this.maxMarkup = null;
  }

  formNovaVenda = this.formBuilder.group({
    dataVenda: ['', Validators.required],
    status: ['Aguardando Aprovação', Validators.required],
    vendedor: [this.currentUser, Validators.required],
    nomeCliente: ['', Validators.required],
    mixProdutos: ['', Validators.required],
    produtoVendido: [''], // Verificar validação
    tecnologia_servico: [''], // Verificar validação
    multiplicador: [''], // Verificar validação
    markup: [0, Validators.required],
    vendaAvulsa: [0, Validators.required],
    valorBase: ['']
  });

  // Grupos de markup
  defineMarkup(grupo_markup: number) {
    this.grupoMarkup = grupo_markup;

    switch (grupo_markup) {
      case 1:
        this.maxMarkup = 2;
        this.minMarkup = 1.6;
        break;
      case 2:
        this.maxMarkup = 2;
        this.minMarkup = 1.7;
        break;
      case 3:
        this.maxMarkup = 2;
        this.minMarkup = 1.8;
        break;
      case 4:
        this.maxMarkup = 2.5;
        this.minMarkup = 1.7;
        break;
      case 5:
        this.maxMarkup = 3;
        this.minMarkup = 1.7;
        break;
      case 6:
        this.maxMarkup = 3.5;
        this.minMarkup = 1.7;
        break;
      case 7:
        this.maxMarkup = 2;
        this.minMarkup = 2;
        break;
      case 8:
        this.maxMarkup = 3;
        this.minMarkup = 2;
        break;
      case 9:
        this.maxMarkup = 3.5;
        this.minMarkup = 2;
        break;
      case 10:
        this.maxMarkup = 6.15;
        this.minMarkup = 3.5;
        break;
      case 11:
        this.maxMarkup = 1.9;
        this.minMarkup = 1.9;
        break;
      default:
        break;
    }
  }

  // Busca o valor do produto selecionado no input "Produto Vendido" e insere no input "Valor Base"
  setInputsValoresNovaVenda(element: any) {
    const el = element.target.innerText.split("-");
    const produtoSelecionado = el[0].trim();
    const tecnologia = el[2] ? `${el[1].trim()} - ${el[2].trim()}` : el[1].trim();
    const mixProduto: HTMLSelectElement = document.querySelector("#modalNew #mixProdutos");

    this.produtos.forEach((item) => {
      if(item.produto.trim() === produtoSelecionado && item.tecnologia_servico.trim() === tecnologia) {
        this.formNovaVenda.get("tecnologia_servico").setValue(tecnologia);
        this.formNovaVenda.get('valorBase').setValue(`${item.valor_venda},00`);
        this.defineMarkup(item.grupo_markup);
        this.formNovaVenda.get('markup').setValue(this.minMarkup);

        if(mixProduto.value === "Help Suporte A" || item.valor_venda === 0) {
          this.mixProdutosValidate = false;
        } else {
          this.mixProdutosValidate = true;
        }
      }
    });
  }

  onSubmitNovaVenda() {
    this.formNovaVenda.updateValueAndValidity();
    const formNovaVendaStatus: string = this.formNovaVenda.status;

      if(formNovaVendaStatus !== "INVALID") {
        this.onLoadComission = true;

        let dataVenda = this.formNovaVenda.get('dataVenda').value;
        let status = this.formNovaVenda.get('status').value;
        let vendedor = this.formNovaVenda.get('vendedor').value;
        let cliente = this.formNovaVenda.get('nomeCliente').value;
        let mixProdutos = this.formNovaVenda.get("mixProdutos").value;
        let tipoProduto = this.formNovaVenda.get('produtoVendido').value;
        let tecnologia_servico = this.formNovaVenda.get("tecnologia_servico").value;
        let multiplicador = Number(this.formNovaVenda.get("multiplicador").value);
        let grupo_markup: number = this.grupoMarkup;
        let markup = Number(this.formNovaVenda.get("markup").value);
        let vendaAvulsa = Number(this.formNovaVenda.get("vendaAvulsa").value);
        let valorBase = parseFloat((this.formNovaVenda.get('valorBase').value).replace(",", "."));
        let valorVendido: number = 0;
        let imageEmailMarkupApproval: File = this.imageEmailMarkupApproval;
    
        // CALCULAR
  
        //Formatando data
        let data = dataVenda.split("-");
        dataVenda = `${data[2]}/${data[1]}/${data[0]}`;
    
        // Se Mix de Produtos == HELP então usar vendaAvulsa
        // senão se valor base == "" então valorVendido == 0 senão (valorBase / 2) * markup;
        if(mixProdutos == "Help Suporte A" || vendaAvulsa !== 0){
          valorBase = vendaAvulsa;
          valorVendido = vendaAvulsa;
        } else if(tipoProduto == ""){
          valorBase = 0;
          valorVendido = 0;
        } else {
          valorBase = valorBase * multiplicador;
          valorVendido = (valorBase / 2) * markup;
        }

        let tipoProdutoFormatado = mixProdutos === 'Help Suporte A' ? '' : `${tipoProduto} - ${tecnologia_servico}`;

        const novaVenda2 = new FormData();
        novaVenda2.append('dataVenda', dataVenda);
        novaVenda2.append('mes', this.defineMes(data[1]));
        novaVenda2.append('ano', data[0]);
        novaVenda2.append('vendedor', this.userPermission() ? vendedor : vendedor.name);
        novaVenda2.append('status', status);
        novaVenda2.append('cliente', cliente);
        novaVenda2.append('mixProdutos', mixProdutos);
        novaVenda2.append('tipoProduto', tipoProdutoFormatado);
        novaVenda2.append('multiplicador', String(multiplicador));
        novaVenda2.append('grupo_markup', String(grupo_markup));
        novaVenda2.append('markup', String(markup));
        novaVenda2.append('vendaAvulsa', String(vendaAvulsa));
        novaVenda2.append('valorBase', String(valorBase));
        novaVenda2.append('valorVendido', String(valorVendido));
        novaVenda2.append('imageEmailMarkupApproval', imageEmailMarkupApproval);

        let dataValida = new Date(Number(data[0]), Number(data[1]) - 1, Number(data[2]));
        // if(this.verificaDataVigente(dataValida) || this.userPermission()) {

        //   if(!this.verificaDataVigente(dataValida)){
        //     console.warn(`Comissão fora do prazo de lançamento.`);
        //   }

        //   this.comissoesService.setComissao(novaVenda2).subscribe(
        //     async (res) => {
        //       this.showMessageAction('Comissão adicionada com sucesso');
        //       await this.submitFormFilter();
        //       this.tabelaVendas._updateChangeSubscription();

        //       this.formNovaVenda = this.formBuilder.group({
        //         dataVenda: ['', Validators.required],
        //         status: ['Aguardando Aprovação', Validators.required],
        //         vendedor: [this.currentUser, Validators.required],
        //         nomeCliente: ['', Validators.required],
        //         mixProdutos: ['', Validators.required],
        //         produtoVendido: [''], // Verificar validação
        //         multiplicador: [''], // Verificar validação
        //         markup: [0, Validators.required],
        //         vendaAvulsa: [0, Validators.required],
        //         valorBase: ['']
        //       });

        //       this.closeModalNovaVenda();
        //     },
        //     async (error) => {
        //       console.error(`Erro ao inserir a comissão`);
        //       console.log(error);
        //       this.showMessageAction('Erro ao criar a comissão');
        //     }
        //   );

        // } else {
        //   console.error(`Comissão fora do prazo de lançamento.`);
        //   this.showMessageAction('Comissão fora do prazo de lançamento.');
        // }

        this.comissoesService.setComissao(novaVenda2).subscribe(
          async (res) => {
            this.showMessageAction('Comissão adicionada com sucesso');
            await this.submitFormFilter();
            this.tabelaVendas._updateChangeSubscription();

            this.formNovaVenda = this.formBuilder.group({
              dataVenda: ['', Validators.required],
              status: ['Aguardando Aprovação', Validators.required],
              vendedor: [this.currentUser, Validators.required],
              nomeCliente: ['', Validators.required],
              mixProdutos: ['', Validators.required],
              produtoVendido: [''], // Verificar validação
              tecnologia_servico: [''], // Verificar validação
              multiplicador: [''], // Verificar validação
              markup: [0, Validators.required],
              vendaAvulsa: [0, Validators.required],
              valorBase: ['']
            });

            this.maxMarkup = 0;
            this.minMarkup = 0;
            this.urlPreviewImage = null;
            this.onLoadComission = false;

            this.closeModalNovaVenda();
          },
          async (error) => {
            this.onLoadComission = false;
            console.error(`Erro ao inserir a comissão`);
            console.log(error);
            this.showMessageAction('Erro ao criar a comissão');
          }
        );
      }
  }

  // EDITAR Comissão
  formEditarVenda = this.formBuilder.group({
    _id: [],
    dataVenda: ['', Validators.required],
    status: ['', Validators.required],
    nomeCliente: ['', Validators.required],
    mixProdutos: ['', Validators.required],
    produtoVendido: ['', Validators.required],
    tecnologia_servico: ['', Validators.required],
    multiplicador: ['', Validators.required],
    markup: [0, Validators.required],
    vendaAvulsa: [0, Validators.required],
    valorBase: [''],
    imageEmailMarkupApproval: ['']
  })

  openModalEditarVenda(element: any) {
    const modal = document.getElementById("modalEdit");
    const bgModal = document.getElementById("bg-modal");

    // Formatando data
    let dataVenda = element.dataVenda;
    let data = dataVenda.split("/");
    dataVenda = `${data[2]}-${data[1]}-${data[0]}`;

    // Definindo valorBase e markup do produto aberto
    let el = element.tipoProduto.split("-");
    let produtoSelecionado: string;
    let tecnologia: string;
    let valorBaseAtual: string;

    if(el && element.tipoProduto !== "") {
      produtoSelecionado = el[0].trim();
      tecnologia = el[2] ? `${el[1].trim()} - ${el[2].trim()}` : el[1].trim();
    }

    this.produtos.forEach((item) => {
      if(item.produto.trim() === produtoSelecionado && item.tecnologia_servico.trim() === tecnologia) {
        valorBaseAtual = `${item.valor_venda}`;
      }
    });

    this.urlPreviewImage = element.imageEmailMarkupApproval;

    // Busca os valores da linha e insere nos inputs
    this.formEditarVenda.patchValue({
      _id: element._id,
      dataVenda: dataVenda,
      status: element.status,
      nomeCliente: element.cliente,
      mixProdutos: element.mixProdutos,
      produtoVendido: produtoSelecionado,
      tecnologia_servico: tecnologia,
      multiplicador: element.multiplicador,
      markup: element.markup,
      vendaAvulsa: element.vendaAvulsa,
      valorBase: valorBaseAtual,
      imageEmailMarkupApproval: element.imageEmailMarkupApproval
    });

    this.defineMarkup(element.grupo_markup);

    if(modal != null){
      modal.style.display = "block";
      bgModal.style.display = "block";
      modal.classList.add("show");
    }
  }

  closeModalEditarVenda() {
    const modal = document.getElementById("modalEdit");
    const bgModal = document.getElementById("bg-modal");
    if(modal != null){
      modal.style.display = "none";
      bgModal.style.display = "none";
      modal.classList.remove("show");
    }

    this.minMarkup = null;
    this.maxMarkup = null;
    this.urlPreviewImage = null;
  }

  // Busca o valor do produto selecionado no input "Produto Vendido" e insere no input "Valor Base"
  setInputsValoresEditarVenda(element: any) {
    const produtoSelecionado = element.target.innerText.split("-")[0].trim();
    const tecnologia = element.target.innerText.split("-")[1].trim();

    this.produtos.forEach((item) => {
      if(item.produto.trim() === produtoSelecionado && item.tecnologia_servico.trim() === tecnologia) {
        this.formEditarVenda.get("produtoVendido").setValue(produtoSelecionado);
        this.formEditarVenda.get("tecnologia_servico").setValue(tecnologia);
        this.formEditarVenda.get('valorBase').setValue(`${item.valor_venda}`);
        this.defineMarkup(item.grupo_markup);
        this.formNovaVenda.get('markup').setValue(this.minMarkup);
      }
    });
  }

  onSubmitEditarVenda() {
    this.onLoadComission = true;

    const id: string = this.formEditarVenda.get('_id').value;
    let dataVenda = this.formEditarVenda.get('dataVenda').value;
    let status = this.formEditarVenda.get('status').value;
    let cliente = this.formEditarVenda.get('nomeCliente').value;
    let mixProdutos = this.formEditarVenda.get("mixProdutos").value;
    let tipoProduto = this.formEditarVenda.get('produtoVendido').value;
    let tecnologia_servico =  this.formEditarVenda.get('tecnologia_servico').value;
    let multiplicador = Number(this.formEditarVenda.get("multiplicador").value);
    let markup = Number(this.formEditarVenda.get("markup").value);
    let vendaAvulsa = Number(this.formEditarVenda.get("vendaAvulsa").value);
    let valorBase: number = Number(this.formEditarVenda.get('valorBase').value);
    let valorVendido: number = 0;
    let grupo_markup: number = this.grupoMarkup;

    // Formatando data
    let data = dataVenda.split("-");
    dataVenda = `${data[2]}/${data[1]}/${data[0]}`;

    // Se Mix de Produtos == HELP então usar vendaAvulsa
    // senão se valor base == "" então valorVendido == 0 senão (valorBase / 2) * markup;
    if(mixProdutos == "Help Suporte A" || vendaAvulsa !== 0){
      valorBase = vendaAvulsa;
      valorVendido = vendaAvulsa;
    } else if(tipoProduto == ""){
      valorBase = 0;
      valorVendido = 0;
    } else {
      valorBase = valorBase * multiplicador;
      valorVendido = (valorBase / 2) * markup;
    }

    const editarVenda2 = new FormData();
    editarVenda2.append('dataVenda', dataVenda);
    editarVenda2.append('mes', this.defineMes(data[1]));
    editarVenda2.append('ano', data[0]);
    editarVenda2.append('status', status);
    editarVenda2.append('cliente', cliente);
    editarVenda2.append('mixProdutos', mixProdutos);
    editarVenda2.append('tipoProduto', `${tipoProduto} - ${tecnologia_servico}`);
    editarVenda2.append('multiplicador', String(multiplicador));
    editarVenda2.append('grupo_markup', String(grupo_markup));
    editarVenda2.append('markup', String(markup));
    editarVenda2.append('vendaAvulsa', String(vendaAvulsa));
    editarVenda2.append('valorBase', String(valorBase));
    editarVenda2.append('valorVendido', String(valorVendido));
    
    if(this.formEditarVenda.get('imageEmailMarkupApproval').value) {
      editarVenda2.append('imageEmailMarkupApproval', this.formEditarVenda.get('imageEmailMarkupApproval').value);
    } else {
      editarVenda2.append('imageEmailMarkupApproval', this.imageEmailMarkupApproval);
    }
    
    this.comissoesService.updateComissao(id, editarVenda2).subscribe(
      async (res) => {
        this.onLoadComission = false;
        this.showMessageAction('Comissão alterada com sucesso');
        await this.submitFormFilter();
        this.tabelaVendas._updateChangeSubscription();
        this.closeModalEditarVenda();
      },
      async (error) => {
        this.onLoadComission = false;
        console.error(`Erro ao editar a comissão: ${error}`);
        this.showMessageAction('ERRO ao editar a comissão');
        await this.submitFormFilter();
        this.tabelaVendas._updateChangeSubscription();
        this.closeModalEditarVenda();
      }
    );
  }


  // DELETE Comissão
  formDeletarVenda = this.formBuilder.group({
    _id: [],
    cliente: [''],
    imageEmailMarkupApproval: ['']
  });

  extratorDeIdPublico(url: string): string | null {
    const regex = /([a-zA-Z0-9]+)\.png$/; // Regex para capturar o texto antes de .png
    const match = url.match(regex);

    return match ? match[1] : null;
  }

  openModalDeletarVenda(element: any){
    const modal = document.getElementById("modalDeletar");
    const bgModal = document.getElementById("bg-modal");
    if(modal != null){
      modal.style.display = "block";
      bgModal.style.display = "block";
      modal.classList.add("show");
    }

    // Busca os valores da linha
    this.formDeletarVenda.patchValue({
      _id: element._id,
      cliente: element.cliente,
      imageEmailMarkupApproval: element.imageEmailMarkupApproval
    });
  }

  closeModalDeletarVenda() {
    const modal = document.getElementById("modalDeletar");
    const bgModal = document.getElementById("bg-modal");
    if(modal != null){
      modal.style.display = "none";
      bgModal.style.display = "none";
      modal.classList.remove("show");
    }
  }

  onSubmitDeletarVenda() {
    const id: string = this.formDeletarVenda.get('_id').value;
    const idPublicoImagemMarkupAprovado = this.extratorDeIdPublico(this.formDeletarVenda.get("imageEmailMarkupApproval").value);
    const formData = new FormData();

    formData.append("publicIdImage", idPublicoImagemMarkupAprovado);

    this.comissoesService.deleteComissao(id, formData).subscribe(
      async (res) => {
        this.showMessageAction('Comissão excluída com sucesso');
        await this.submitFormFilter();
        this.tabelaVendas._updateChangeSubscription();
        this.closeModalDeletarVenda();
      },
      async (error) => {
        console.error(`Erro ao excluir a comissão: ${error}`);
        this.showMessageAction('ERRO ao excluir a comissão');
        await this.submitFormFilter();
        this.tabelaVendas._updateChangeSubscription();
        this.closeModalDeletarVenda();
      }
    );
  }
}