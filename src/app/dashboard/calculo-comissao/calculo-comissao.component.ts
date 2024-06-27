import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { SharedModule } from 'src/app/modules/shared-module/shared-module.module';

import { Produtos } from '../tabela-valores/interfaceProdutos';
import { ComissoesService } from 'src/app/services/comissoes.service';
import { ProductsService } from 'src/app/services/products.service';
import { Comissao } from './interfaceComissao';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-calculo-comissao',
  templateUrl: './calculo-comissao.component.html',
  styleUrls: ['./calculo-comissao.component.css'],
  standalone: true,
  imports: [ SharedModule ]
})

export class CalculoComissaoComponent implements OnInit {
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
  produtos: Produtos[] = [];
  produtosFiltrados: any[] = [];
  mesFiltro: string = null;
  currentUser = this.authService.getUser();  // Traz os dados do usuário

  /* INDICADORES GERADOS A PARTIR DAS VENDAS */
  vendasTotal: number = 0;   // Soma de todos os Valores Vendidos
  fatorMultiplicador: number = 0.025; // Entrada de INPUT
  metaVendedor: number = 0.04; // Igual planilha para exemplo (Criar requisição no futuro - verificar de onde virá esses valores)
  qualidade: number = 0; // Se valorTotal == 0 então qualidade = 0 senão (valorTotal * 2) / soma(valoresBase)
  metaEmpresa: number = 0.1; // Igual planilha para exemplo (Criar requisição no futuro - verificar de onde virá esses valores)
  mix: number = 0.5; // Se tiver pelo menos 1 produto MKT e 1 produto TEC, mix = 1 senão mix = 0,5
  comissaoFinal: number = 0; // (100 * vendasTotal * mix * qualidade * metaEmpresa * metaVendedor)
  valorComissao: number = 1.68; // (vendasTotal * comissaoFinal) / 100) - (vendasTotal * comissaoFinal) / 100) * 0.16
  valorBaseTotal: number = 0;

  /* Variáveis e métodos de controle de front */
  userPermission(): boolean {
    if(this.currentUser.accessLevel == "Administrador" || this.currentUser.name == "Valeria Queiroz"){
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

  defineMixProdutosValidate(): boolean {
    const modalNew = document.getElementById("modalNew");
    const modalEdit = document.getElementById("modalEdit");
    let mixProdutosNovaVenda = this.formNovaVenda.get('mixProdutos').value;
    let mixProdutosEditarVenda = this.formEditarVenda.get('mixProdutos').value;

    if(modalNew.style.display == "block") {
      if(mixProdutosNovaVenda == 'help' || mixProdutosNovaVenda == ''){
        return this.mixProdutosValidate = false;
      } else {
        return this.mixProdutosValidate = true;
      }
    } else if(modalEdit.style.display == "block") {
      if(mixProdutosEditarVenda == 'help' || mixProdutosEditarVenda == ''){
        return this.mixProdutosValidate = false;
      } else {
        return this.mixProdutosValidate = true;
      }
    } else {
      return this.mixProdutosValidate = false;
    }
  }

  yearsSelectFilter: string[] = []; // Array povoado pelo método loadComissoes()

  /* Fim Variáveis e métodos de controle de front */

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private _liveAnnouncer: LiveAnnouncer,
    private formBuilder: FormBuilder,
    private comissoesService: ComissoesService,
    private productService: ProductsService
  ){}

  ngOnInit(): void {

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

    // Carrega todos os produtos
    this.loadProdutos();

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

  // Carrega todos os produtos
  loadProdutos() {
    this.productService.getProducts().subscribe(
      async (data) => {
        this.produtos = data
        this.produtosFiltrados = this.produtos;
      }, (err) => {
        console.error(err)
      }
    );
  }

  // Verifica os Mix de produtos para definir o valor Mix do Mês
  verifyProductsMix(data) {
    const haveProductMixTechnology = data.some(produto => produto.mixProdutos === "tecnologia");
    const haveProductMixMarketing = data.some(produto => produto.mixProdutos === "marketing");
    return haveProductMixTechnology && haveProductMixMarketing;
  }

  // Função para filtrar comissões por mês e/ou ano
  submitFormFilter() {
    let yearSelect: HTMLSelectElement = document.querySelector("#years");
    let monthSelect: HTMLSelectElement = document.querySelector("#months");
    let vendedorSelect: HTMLSelectElement = document.querySelector("#vendedor");

    let year: string = yearSelect.selectedOptions[0].value;
    let month: string = monthSelect.selectedOptions[0].value;
    let vendedor: string = vendedorSelect.selectedOptions[0].value;

    this.loadComissoes(month, year, vendedor);
  }

  // Carrega as comissões de acordo com o filtro
  loadComissoes(filterMonth: string = "sem filtro", filterYear: string = "sem filtro", vendedor: string = "sem filtro") {
    if(this.userPermission()) {
      let usuario: string = "adm";
      this.comissoesService.getComissoes(usuario, filterMonth, filterYear, vendedor).subscribe(
        async (data) => {
          this.generateTableAndCommissions(data);
        }, (err) => {
          console.error(err);
        }
      );
    } else {
      let vendedor: string = this.currentUser.name;
      this.comissoesService.getComissoes(vendedor, filterMonth, filterYear).subscribe(
        async (data) => {
          this.generateTableAndCommissions(data);
        }, (err) => {
          console.error(err);
        }
      );
    }
  }

  // Cria a tabela e faz o cálculo das comissões de acordo com o método loadComissoes
  generateTableAndCommissions(data: any) {
    this.tabelaVendas = new MatTableDataSource<Comissao>(data);

    let somaVendas: number = 0;
    let somaValoresBase: number = 0;

    data.map((venda) => {
      // BUSCA OS ANOS PARA INSERIR NO SELECT DO FRONT
      const ano = venda.ano;
      if(!this.yearsSelectFilter.includes(ano)){
        this.yearsSelectFilter.push(ano);
      }

      // VENDAS TOTAL
      if(venda.valorVendido) {
        somaVendas += Number(venda.valorVendido);
        this.vendasTotal = somaVendas;
      }

      // VALOR BASE
      if(venda.valorBase) {
        somaValoresBase += venda.valorBase;
        this.valorBaseTotal < somaValoresBase ? this.valorBaseTotal = somaValoresBase : this.valorBaseTotal;
      }

      // QUALIDADE
      if(this.vendasTotal == 0) {
        this.qualidade = this.vendasTotal;
      } else {
        this.qualidade = Number(((this.vendasTotal * 2) / this.valorBaseTotal).toFixed(2));
      }

      // MIX
      this.verifyProductsMix(data);
      if(this.verifyProductsMix(data)) {
        // if(venda.mix == 0.5) { this.changeMixValue(venda, true) }
        if(this.mix == 0.5) { this.mix = 1 }
      } else {
        // if(venda.mix == 1){ this.changeMixValue(venda, false) }
        if(this.mix == 1){ this.mix = 0.5 }
      }

      // COMISSÃO FINAL
      // Se (100 * vendasTotal * mix * qualidade * metaEmpresa * metaVendedor) >= 6,2 então comissaoFinal = 6,2 senão
      // comissaoFinal = (100 * vendasTotal * mix * qualidade * metaEmpresa * metaVendedor)
      let calcComissaoFinal = Number((100 * this.fatorMultiplicador * this.mix * this.qualidade * this.metaEmpresa * this.metaVendedor).toFixed(2));
      calcComissaoFinal >= 6.2 ? this.comissaoFinal = 6.2 : this.comissaoFinal = calcComissaoFinal;

      // R$ COMISSÃO
      this.valorComissao = Number((((this.vendasTotal * this.comissaoFinal) / 100) - (((this.vendasTotal * this.comissaoFinal) / 100) * 0.16)).toFixed(2));
    });
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
    if(this.produtosFiltrados.length == 0) {
      this.produtosFiltrados = this.produtos.filter(item => item.tecnologia.toLowerCase().includes(filterValue.toLowerCase()));
    };
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

  // CRIAR Comissão
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
  }

  formNovaVenda = this.formBuilder.group({
    dataVenda: ['', Validators.required],
    status: ['Aguardando Aprovação', Validators.required],
    nomeCliente: ['', Validators.required],
    mixProdutos: ['', Validators.required],
    produtoVendido: ['', Validators.required],
    multiplicador: ['', Validators.required],
    markup: [0, Validators.required],
    vendaAvulsa: [0, Validators.required],
    valorBase: ['']
  });

  // Busca o valor do produto selecionado no input "Produto Vendido" e insere no input "Valor Base"
  setInputsValoresNovaVenda() {
    const produtoSelecionado = this.formNovaVenda.get("produtoVendido").value;
    this.produtos.map((item) => {
      if(item.produto === produtoSelecionado) {
        this.formNovaVenda.get('valorBase').setValue(`${item.valor_venda},00`);
      }
    })
  }

  onSubmitNovaVenda() {
    this.formNovaVenda.updateValueAndValidity();
    const formNovaVendaStatus: string = this.formNovaVenda.status;

    if(formNovaVendaStatus !== "INVALID") {
      let dataVenda = this.formNovaVenda.get('dataVenda').value;
      let status = this.formNovaVenda.get('status').value;
      let vendedor = this.currentUser.name;
      let cliente = this.formNovaVenda.get('nomeCliente').value;
      let mixProdutos = this.formNovaVenda.get("mixProdutos").value;
      let tipoProduto = this.formNovaVenda.get('produtoVendido').value;
      let multiplicador = Number(this.formNovaVenda.get("multiplicador").value);
      let markup = Number(this.formNovaVenda.get("markup").value);
      let vendaAvulsa = Number(this.formNovaVenda.get("vendaAvulsa").value);
      let valorBase = Number(this.formNovaVenda.get('valorBase').value.replace(",", "."));
      let valorVendido: number = 0;
  
      // CALCULAR

      //Formatando data
      let data = dataVenda.split("-");
      dataVenda = `${data[2]}/${data[1]}/${data[0]}`;
  
      // Se Mix de Produtos == HELP então usar vendaAvulsa
      // senão se valor base == "" então valorVendido == 0 senão (valorBase / 2) * markup;
      if(mixProdutos == "help"){
        valorVendido = vendaAvulsa;
      } else if(mixProdutos == ""){
        valorVendido = 0;
      } else {
        valorVendido = (valorBase / 2) * markup;
      }

      const novaVenda = {
        dataVenda: dataVenda,
        mes: this.defineMes(data[1]),
        ano: data[0],
        vendedor: vendedor,
        status: status,
        cliente: cliente,
        mixProdutos: mixProdutos,
        tipoProduto: tipoProduto,
        multiplicador: multiplicador,
        markup: markup,
        vendaAvulsa: vendaAvulsa,
        valorBase: valorBase,
        valorVendido: valorVendido
      }
      
      this.comissoesService.setComissao(novaVenda).subscribe(
        async (res) => {
          this.showMessageAction('Comissão adicionada com sucesso');
          console.log(novaVenda);
          await this.loadComissoes();
          this.tabelaVendas._updateChangeSubscription();
          this.closeModalNovaVenda();
        },
        async (error) => {
          console.log(novaVenda);
          console.error(`Erro ao inserir a comissão: ${error}`);
          this.showMessageAction('ERRO ao criar a comissão');
          await this.loadComissoes();
          this.tabelaVendas._updateChangeSubscription();
          this.closeModalNovaVenda();
        }
      );
    }

    this.formNovaVenda = this.formBuilder.group({
      dataVenda: ['', Validators.required],
      status: ['Aguardando Aprovação', Validators.required],
      nomeCliente: ['', Validators.required],
      mixProdutos: ['', Validators.required],
      produtoVendido: ['', Validators.required],
      multiplicador: ['', Validators.required],
      markup: [0, Validators.required],
      vendaAvulsa: [0, Validators.required],
      valorBase: ['']
    });
  }


  // EDITAR Comissão
  formEditarVenda = this.formBuilder.group({
    _id: [],
    dataVenda: ['', Validators.required],
    status: ['', Validators.required],
    nomeCliente: ['', Validators.required],
    mixProdutos: ['', Validators.required],
    produtoVendido: ['', Validators.required],
    multiplicador: ['', Validators.required],
    markup: [0, Validators.required],
    vendaAvulsa: [0, Validators.required],
    valorBase: ['']
  })

  openModalEditarVenda(element: any) {
    const modal = document.getElementById("modalEdit");
    const bgModal = document.getElementById("bg-modal");

    // Formatando data
    let dataVenda = element.dataVenda;
    let data = dataVenda.split("/");
    dataVenda = `${data[2]}-${data[1]}-${data[0]}`;

    // Busca os valores da linha e insere nos inputs
    this.formEditarVenda.patchValue({
      _id: element._id,
      dataVenda: dataVenda,
      status: element.status,
      nomeCliente: element.cliente,
      mixProdutos: element.mixProdutos,
      produtoVendido: element.tipoProduto,
      multiplicador: element.multiplicador,
      markup: element.markup,
      vendaAvulsa: element.vendaAvulsa,
      valorBase: element.valorBase
    })

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
  }

  // Busca o valor do produto selecionado no input "Produto Vendido" e insere no input "Valor Base"
  setInputsValoresEditarVenda() {
    const produtoSelecionado = this.formEditarVenda.get("produtoVendido").value;
    this.produtos.map((item) => {
      if(item.produto === produtoSelecionado) {
        this.formEditarVenda.get('valorBase').setValue(`${item.valor_venda},00`);
      }
    })
  }

  onSubmitEditarVenda() {
    const id: string = this.formEditarVenda.get('_id').value;
    let dataVenda = this.formEditarVenda.get('dataVenda').value;
    let status = this.formEditarVenda.get('status').value;
    let cliente = this.formEditarVenda.get('nomeCliente').value;
    let mixProdutos = this.formEditarVenda.get("mixProdutos").value;
    let tipoProduto = this.formEditarVenda.get('produtoVendido').value;
    let multiplicador = Number(this.formEditarVenda.get("multiplicador").value);
    let markup = Number(this.formEditarVenda.get("markup").value);
    let vendaAvulsa = Number(this.formEditarVenda.get("vendaAvulsa").value);
    let valorBase = Number(this.formEditarVenda.get('valorBase').value);
    let valorVendido: number = 0;

    // Formatando data
    let data = dataVenda.split("-");
    dataVenda = `${data[2]}/${data[1]}/${data[0]}`;

    // Se Mix de Produtos == HELP então usar vendaAvulsa
    // senão se valor base == "" então valorVendido == 0 senão (valorBase / 2) * markup;
    if(mixProdutos == "help"){
      valorVendido = vendaAvulsa;
    } else if(mixProdutos == ""){
      valorVendido = 0;
    } else {
      valorVendido = (valorBase / 2) * markup;
    }

    const editarVenda = {
      dataVenda: dataVenda,
      mes: this.defineMes(data[1]),
      ano: data[2],
      status: status,
      cliente: cliente,
      mixProdutos: mixProdutos,
      tipoProduto: tipoProduto,
      multiplicador: multiplicador,
      markup: markup,
      vendaAvulsa: vendaAvulsa,
      valorBase: valorBase,
      valorVendido: valorVendido
    }
    
    this.comissoesService.updateComissao(id, editarVenda).subscribe(
      async (res) => {
        this.showMessageAction('Comissão alterada com sucesso');
        await this.loadComissoes();
        this.tabelaVendas._updateChangeSubscription();
        this.closeModalEditarVenda();
      },
      async (error) => {
        console.error(`Erro ao editar a comissão: ${error}`);
        this.showMessageAction('ERRO ao editar a comissão');
        await this.loadComissoes();
        this.tabelaVendas._updateChangeSubscription();
        this.closeModalEditarVenda();
      }
    );
  }


  // DELETE Comissão
  formDeletarVenda = this.formBuilder.group({
    _id: [],
    cliente: ['']
  })

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
      cliente: element.cliente
    })
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
    this.comissoesService.deleteComissao(id).subscribe(
      async (res) => {
        this.showMessageAction('Produto excluído com sucesso');
        await this.loadComissoes();
        this.tabelaVendas._updateChangeSubscription();
        this.closeModalDeletarVenda();
      },
      async (error) => {
        console.error(`Erro ao excluir a comissão: ${error}`);
        this.showMessageAction('ERRO ao excluir a comissão');
        await this.loadComissoes();
        this.tabelaVendas._updateChangeSubscription();
        this.closeModalDeletarVenda();
      }
    );
  }
}
