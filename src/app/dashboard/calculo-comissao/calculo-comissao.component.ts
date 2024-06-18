import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

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
  displayedColumns: string[] = ['cliente', 'dataVenda', 'mixProdutos', 'tipoProduto', 'multiplicador', 'markup', 'vendaAvulsa', 'valorBase', 'valorVendido', 'qualidade', 'mix', 'comissaoFinal', 'valorComissao','actions'];
  tabelaVendas: MatTableDataSource<Comissao> = new MatTableDataSource<Comissao>([]);
  msgActions: string;
  produtos: Produtos[] = [];
  produtosFiltrados: any[] = [];
  vendasTotal: number = 0;   // Soma de todos os Valores Vendidos

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

  // Carrega todas as comissões
  loadComissoes() {
    this.comissoesService.getComissoes().subscribe(
      async (data) => {
        this.tabelaVendas = new MatTableDataSource<Comissao>(data);
        data.map((venda) => {
          this.vendasTotal += venda.valorBase + venda.vendaAvulsa;
          // if(venda.mix == 0.5) {
          //   this.verifyProductsMix(data) ? this.onSubmitEditarVenda(data) : null;
          // }
        });
      }, (err) => {
        console.error(err)
      }
    );
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // Traz o nome do vendedor
  vendedor = this.authService.getUser();

  // Criar regra de cálculo baseada na nova tabela de metas (criar)
  metaVendedor: number = 0.4;

  // Criar regra de cálculo baseada na nova tabela de metas (criar)
  metaEmpresa: number = 0.1;

  // Se valorTotal == 0 então qualidade = 0 senão (valorTotal * 2) / soma(valoresBase)
  qualidade: number = 0;

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
    dataVenda: [new Date(), Validators.required],
    nomeCliente: ['', Validators.required],
    mixProdutos: ['', Validators.required],
    produtoVendido: ['', Validators.required],
    multiplicador: ['', Validators.required],
    markup: [0, Validators.required],
    vendaAvulsa: ['0,00', Validators.required],
    fatorMultiplicador: ['', Validators.required],
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
      let vendedor = this.vendedor.name;
      let cliente = this.formNovaVenda.get('nomeCliente').value;
      let mixProdutos = this.formNovaVenda.get("mixProdutos").value;
      let tipoProduto = this.formNovaVenda.get('produtoVendido').value;
      let multiplicador = Number(this.formNovaVenda.get("multiplicador").value);
      let markup = Number(this.formNovaVenda.get("markup").value);
      let vendaAvulsa = Number(this.formNovaVenda.get("vendaAvulsa").value);
      let fatorMultiplicador = Number(this.formNovaVenda.get('fatorMultiplicador').value);
      let valorBase = Number(this.formNovaVenda.get('valorBase').value.replace(",", "."));
      let valorVendido: number = 0;
      let qualidade: number = 0;
      let mix: number = 0; // Se tiver pelo menos 1 produto MKT e 1 produto TEC, mix = 1 senão mix = 0,5
      let comissaoFinal: number = 0;
      let valorComissao: number = 0;
  
      // CALCULAR
  
      // Se Mix de Produtos == HELP então usar vendaAvulsa
      // senão se valor base == "" então valorVendido == 0 senão (valorBase / 2) * markup;
      if(mixProdutos == "help"){
        valorVendido = vendaAvulsa;
      } else if(mixProdutos == ""){
        valorVendido = 0;
      } else {
        valorVendido = (valorBase / 2) * markup;
      }
  
      // venda avulsa + valor base
      this.vendasTotal = vendaAvulsa + valorBase;
  
      // verificar regra acima
      if(this.vendasTotal == 0) {
        qualidade = Number(this.vendasTotal.toFixed(2));
      } else {
        qualidade = Number(((this.vendasTotal * 2) / valorBase).toFixed(2));
      }
  
      // Se tiver pelo menos 1 produto MKT e 1 produto TEC, mix = 1 senão mix = 0,5
      const validaProdutosVendidosMarketing = this.tabelaVendas.data.some(item => item.mixProdutos === "marketing");
      const validaProdutosVendidosTecnologia = this.tabelaVendas.data.some(item => item.mixProdutos === "tecnologia");
      validaProdutosVendidosMarketing && validaProdutosVendidosTecnologia ? mix = 1 : mix = 0.5;
  
      // Se (100 * vendasTotal * mix * qualidade * metaEmpresa * metaVendedor) >= 6,2 então comissaoFinal = 6,2 senão
      // comissaoFinal = (100 * vendasTotal * mix * qualidade * metaEmpresa * metaVendedor)
      let calcComissaoFinal = Number((100 * fatorMultiplicador * mix * qualidade * this.metaEmpresa * this.metaVendedor).toFixed(2));
      calcComissaoFinal >= 6.2 ? comissaoFinal = 6.2 : comissaoFinal = calcComissaoFinal;
  
      // Cálculo Valor (R$) Comissão
      valorComissao = ((this.vendasTotal * comissaoFinal) / 100) - (((this.vendasTotal * comissaoFinal) / 100) * 0.16);

      const novaVenda = {
        dataVenda: dataVenda,
        vendedor: vendedor,
        cliente: cliente,
        mixProdutos: mixProdutos,
        tipoProduto: tipoProduto,
        multiplicador: multiplicador,
        markup: markup,
        vendaAvulsa: vendaAvulsa,
        fatorMultiplicador: fatorMultiplicador,
        valorBase: valorBase,
        valorVendido: valorVendido,
        qualidade: qualidade,
        mix: mix,
        comissaoFinal: comissaoFinal,
        valorComissao: valorComissao
      }
      
      this.comissoesService.setComissao(novaVenda).subscribe(
        (res) => {
          this.showMessageAction('Comissão adicionada com sucesso');
          console.log(novaVenda);
          this.loadComissoes();
          this.tabelaVendas._updateChangeSubscription();
          this.closeModalNovaVenda();
        },
        (error) => {
          console.error(`Erro ao inserir a comissão: ${error}`);
          this.showMessageAction('ERRO ao criar a comissão');
          this.loadComissoes();
          this.tabelaVendas._updateChangeSubscription();
          this.closeModalNovaVenda();
        }
      );
    }

    this.formNovaVenda = this.formBuilder.group({
      dataVenda: [new Date(), Validators.required],
      nomeCliente: ['', Validators.required],
      mixProdutos: ['', Validators.required],
      produtoVendido: ['', Validators.required],
      multiplicador: ['', Validators.required],
      markup: [0, Validators.required],
      vendaAvulsa: ['', Validators.required],
      fatorMultiplicador: ['', Validators.required],
      valorBase: ['']
    });
  }


  // EDITAR Comissão
  formEditarVenda = this.formBuilder.group({
    _id: [],
    dataVenda: [new Date(), Validators.required],
    nomeCliente: ['', Validators.required],
    mixProdutos: ['', Validators.required],
    produtoVendido: ['', Validators.required],
    multiplicador: ['', Validators.required],
    markup: [0, Validators.required],
    vendaAvulsa: ['', Validators.required],
    fatorMultiplicador: ['', Validators.required],
    valorBase: ['']
  })

  openModalEditarVenda(element: any){
    const modal = document.getElementById("modalEdit");
    const bgModal = document.getElementById("bg-modal");

    // Busca os valores da linha e insere nos inputs
    this.formEditarVenda.patchValue({
      _id: element._id,
      nomeCliente: element.cliente,
      mixProdutos: element.mixProdutos,
      produtoVendido: element.tipoProduto,
      multiplicador: element.multiplicador,
      markup: element.markup,
      vendaAvulsa: element.vendaAvulsa,
      fatorMultiplicador: element.fatorMultiplicador,
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

  onSubmitEditarVenda(data = null) {
    if(data === null) {
      this.formEditarVenda.updateValueAndValidity();
      const formEditarVendaStatus: string = this.formEditarVenda.status;

      if(formEditarVendaStatus !== "INVALID") {
        const id: string = this.formEditarVenda.get('_id').value;
        let dataVenda = this.formEditarVenda.get('dataVenda').value;
        let vendedor = this.vendedor.name;
        let cliente = this.formEditarVenda.get('nomeCliente').value;
        let mixProdutos = this.formEditarVenda.get("mixProdutos").value;
        let tipoProduto = this.formEditarVenda.get('produtoVendido').value;
        let multiplicador = Number(this.formEditarVenda.get("multiplicador").value);
        let markup = Number(this.formEditarVenda.get("markup").value);
        let vendaAvulsa = Number(this.formEditarVenda.get("vendaAvulsa").value);
        let fatorMultiplicador = Number(this.formEditarVenda.get('fatorMultiplicador').value);
        let valorBase = Number(this.formEditarVenda.get('valorBase').value);
        let valorVendido: number = 0;
        let qualidade: number = 0;
        let mix: number = 0;
        let comissaoFinal: number = 0;
        let valorComissao: number = 0;
    
        // CALCULAR
    
        // Se Mix de Produtos == HELP então usar vendaAvulsa
        // senão se valor base == "" então valorVendido == 0 senão (valorBase / 2) * markup;
        if(mixProdutos == "help"){
          valorVendido = vendaAvulsa;
        } else if(mixProdutos == ""){
          valorVendido = 0;
        } else {
          valorVendido = (valorBase / 2) * markup;
        }
    
        // venda avulsa + valor base
        this.vendasTotal = vendaAvulsa + valorBase;
    
        // verificar regra acima
        this.vendasTotal == 0 ? qualidade = this.vendasTotal : qualidade = (this.vendasTotal * 2) / valorBase;
    
        // Se tiver pelo menos 1 produto MKT e 1 produto TEC, mix = 1 senão mix = 0,5
        const validaProdutosVendidosMarketing = this.tabelaVendas.data.some(item => item.mixProdutos === "marketing");
        const validaProdutosVendidosTecnologia = this.tabelaVendas.data.some(item => item.mixProdutos === "tecnologia");
        validaProdutosVendidosMarketing && validaProdutosVendidosTecnologia ? mix = 1 : mix = 0.5;
    
        // Se (100 * vendasTotal * mix * qualidade * metaEmpresa * metaVendedor) >= 6,2 então comissaoFinal = 6,2 senão
        // comissaoFinal = (100 * vendasTotal * mix * qualidade * metaEmpresa * metaVendedor)
        let calcComissaoFinal = 100 * fatorMultiplicador * mix * qualidade * this.metaEmpresa * this.metaVendedor;
        calcComissaoFinal >= 6.2 ? comissaoFinal = 6.2 : comissaoFinal = calcComissaoFinal;
    
        // Cálculo Valor (R$) Comissão
        valorComissao = ((this.vendasTotal * comissaoFinal) / 100) - (((this.vendasTotal * comissaoFinal) / 100) * 0.16);

        const editarVenda = {
          dataVenda: dataVenda,
          vendedor: vendedor,
          cliente: cliente,
          mixProdutos: mixProdutos,
          tipoProduto: tipoProduto,
          multiplicador: multiplicador,
          markup: markup,
          vendaAvulsa: vendaAvulsa,
          fatorMultiplicador: fatorMultiplicador,
          valorBase: valorBase,
          valorVendido: valorVendido,
          qualidade: qualidade,
          mix: mix,
          comissaoFinal: comissaoFinal,
          valorComissao: valorComissao
        }
        
        this.comissoesService.updateComissao(id, editarVenda).subscribe(
          async (res) => {
            this.showMessageAction('Comissão alterada com sucesso');
            await this.loadComissoes();
            this.tabelaVendas._updateChangeSubscription();
            this.closeModalEditarVenda();
          },
          (error) => {
            console.error(`Erro ao editar a comissão: ${error}`);
            this.showMessageAction('ERRO ao editar a comissão');
            this.loadComissoes();
            this.tabelaVendas._updateChangeSubscription();
            this.closeModalEditarVenda();
          }
        );
      }
    } else {
      const id: string = data._id;
      let dataVenda = data.dataVenda;
      let vendedor = data.vendedor;
      let cliente = data.cliente;
      let mixProdutos = data.mixProdutos;
      let tipoProduto = data.tipoProduto;
      let multiplicador = data.multiplicador
      let markup = data.markup;
      let vendaAvulsa = data.vendaAvulsa;
      let fatorMultiplicador = data.fatorMultiplicador;
      let valorBase = data.valorBase;
      let valorVendido: number = data.valorVendido;
      let qualidade: number = data.qualidade;
      let mix: number = data.mix;
      let comissaoFinal: number = data.comissaoFinal;
      let valorComissao: number = data.valorComissao;
  
      // CALCULAR
  
      // Se tiver pelo menos 1 produto MKT e 1 produto TEC, mix = 1 senão mix = 0,5
      const validaProdutosVendidosMarketing = this.tabelaVendas.data.some(item => item.mixProdutos === "marketing");
      const validaProdutosVendidosTecnologia = this.tabelaVendas.data.some(item => item.mixProdutos === "tecnologia");
      validaProdutosVendidosMarketing && validaProdutosVendidosTecnologia ? mix = 1 : mix = 0.5;
  
      // Se (100 * vendasTotal * mix * qualidade * metaEmpresa * metaVendedor) >= 6,2 então comissaoFinal = 6,2 senão
      // comissaoFinal = (100 * vendasTotal * mix * qualidade * metaEmpresa * metaVendedor)
      let calcComissaoFinal = 100 * fatorMultiplicador * mix * qualidade * this.metaEmpresa * this.metaVendedor;
      calcComissaoFinal >= 6.2 ? comissaoFinal = 6.2 : comissaoFinal = calcComissaoFinal;
  
      // Cálculo Valor (R$) Comissão
      valorComissao = ((this.vendasTotal * comissaoFinal) / 100) - (((this.vendasTotal * comissaoFinal) / 100) * 0.16);

      const editarVenda = {
        dataVenda: dataVenda,
        vendedor: vendedor,
        cliente: cliente,
        mixProdutos: mixProdutos,
        tipoProduto: tipoProduto,
        multiplicador: multiplicador,
        markup: markup,
        vendaAvulsa: vendaAvulsa,
        fatorMultiplicador: fatorMultiplicador,
        valorBase: valorBase,
        valorVendido: valorVendido,
        qualidade: qualidade,
        mix: mix,
        comissaoFinal: comissaoFinal,
        valorComissao: valorComissao
      }

      this.comissoesService.updateComissao(id, editarVenda).subscribe(
        async (res) => {
          this.showMessageAction('Comissão alterada com sucesso');
          await this.loadComissoes();
          this.tabelaVendas._updateChangeSubscription();
          this.closeModalEditarVenda();
        },
        (error) => {
          console.error(`Erro ao editar a comissão: ${error}`);
          this.showMessageAction('ERRO ao editar a comissão');
          this.loadComissoes();
          this.tabelaVendas._updateChangeSubscription();
          this.closeModalEditarVenda();
        }
      );
    }
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
      (res) => {
        this.showMessageAction('Produto excluído com sucesso');
        this.loadComissoes();
        this.tabelaVendas._updateChangeSubscription();
        this.closeModalDeletarVenda();
      },
      (error) => {
        console.error(`Erro ao excluir a comissão: ${error}`);
        this.showMessageAction('ERRO ao excluir a comissão');
        this.loadComissoes();
        this.tabelaVendas._updateChangeSubscription();
        this.closeModalDeletarVenda();
      }
    );
  }
}
