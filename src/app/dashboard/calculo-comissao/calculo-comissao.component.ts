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
import { json } from 'body-parser';


@Component({
  selector: 'app-calculo-comissao',
  templateUrl: './calculo-comissao.component.html',
  styleUrls: ['./calculo-comissao.component.css'],
  standalone: true,
  imports: [ SharedModule ]
})

export class CalculoComissaoComponent implements OnInit {
  displayedColumns: string[] = ['cliente', 'mixProdutos', 'tipoProduto', 'multiplicador', 'markup', 'vendaAvulsa', 'valorBase', 'valorVendido', 'qualidade', 'mix', 'comissaoFinal', 'valorComissao','actions'];
  tabelaVendas: MatTableDataSource<Comissao> = new MatTableDataSource<Comissao>([]);
  selectedValue: string;
  selectedCar: string;
  msgActions: string;

  produtos: Produtos[] = [];
  produtosFiltrados: any[] = [];
  selectProdutos = new FormControl();
  selectMixProdutos = new FormControl();

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

  loadComissoes() {
    this.comissoesService.getComissoes().subscribe(
      async (data) => {
        this.tabelaVendas = new MatTableDataSource<Comissao>(data);
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

  // Soma de todos os Valores Vendidos
  vendasTotal: number = 0;

  // Criar regra de cálculo baseada na nova tabela de metas (criar)
  metaVendedor: number = 0.4;

  // Criar regra de cálculo baseada na nova tabela de metas (criar)
  metaEmpresa: number = 0;

  // Se valorTotal == 0 então qualidade = 0 senão (valorTotal * 2) / soma(valoresBase)
  qualidade = 0;

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
    nomeCliente: ['', Validators.required],
    mixProdutos: ['', Validators.required],
    produtoVendido: ['', Validators.required],
    multiplicador: ['', Validators.required],
    markup: [0, Validators.required],
    vendaAvulsa: ['', Validators.required],
    fatorMultiplicador: ['', Validators.required],
    valorBase: ['']
  });

  // Busca o valor do produto selecionado no input "Produto Vendido" e insere no input "Valor Base"
  setInputsValores() {
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

      let vendedor = this.vendedor.name;
      let cliente = this.formNovaVenda.get('nomeCliente').value;
      let mixProdutos = this.formNovaVenda.get("mixProdutos").value;
      let tipoProduto = this.formNovaVenda.get('produtoVendido').value;
      let multiplicador = Number(this.formNovaVenda.get("multiplicador").value);
      let markup = Number(this.formNovaVenda.get("markup").value);
      let vendaAvulsa = Number(this.formNovaVenda.get("vendaAvulsa").value);
      let fatorMultiplicador = Number(this.formNovaVenda.get('fatorMultiplicador').value);
      let valorBase = Number(this.formNovaVenda.get('valorBase').value);
      let valorVendido = 0;
      let qualidade = 0;
      let mix = 0; // Se tiver pelo menos 1 produto MKT e 1 produto TEC, mix = 1 senão mix = 0,5
      let comissaoFinal = 0;
      let valorComissao = 0;
  
      // CALCULAR

      console.log(this.formNovaVenda.get('valorBase').value);
      // valorBase = this.produtos.forEach((produto) => {
      //   if(produto.)
      // })
  
      // Se Mix de Produtos == HELP então usar vendaAvulsa
      // senão se valor base == "" então valorVendido == "" senão (valorBase / 2) * markup;
      if(mixProdutos == "help"){
        valorVendido = vendaAvulsa;
      } else if(mixProdutos == ""){
        valorVendido = 0;
      } else {
        valorVendido = (valorBase / 2) * markup;
      }
  
      // venda avulsa + valor base
      this.vendasTotal = vendaAvulsa + valorBase;
  
  
      if(this.vendasTotal == 0){
        this.qualidade = this.vendasTotal;
      } else {
        this.qualidade = (this.vendasTotal * 2) / valorBase; // verificar regra acima
      }
  
      // Se tiver pelo menos 1 produto MKT e 1 produto TEC, mix = 1 senão mix = 0,5
      let listaProdutosVendidos = [{produto: "teste", mixProdutos: "marketing"}, {produto: "teste2", mixProdutos: "tecnologia"}];
      const validaProdutosVendidosMarketing = listaProdutosVendidos.some(item => item.mixProdutos === "marketing");
      const validaProdutosVendidosTecnologia = listaProdutosVendidos.some(item => item.mixProdutos === "tecnologia");
      if(validaProdutosVendidosMarketing && validaProdutosVendidosTecnologia) {
        mix = 1;
      }
  
      // Se (100 * vendasTotal * mix * qualidade * metaEmpresa * metaVendedor) >= 6,2 então comissaoFinal = 6,2 senão
      // comissaoFinal = (100 * vendasTotal * mix * qualidade * metaEmpresa * metaVendedor)
      let calcComissaoFinal = 100 * fatorMultiplicador * mix * this.qualidade * this.metaEmpresa * this.metaVendedor;
      if(calcComissaoFinal >= 6.2) {
        comissaoFinal = 6.2;
      } else {
        comissaoFinal = calcComissaoFinal;
      }
  
      // Cálculo Valor (R$) Comissão
      valorComissao = ((this.vendasTotal * comissaoFinal) / 100) - (((this.vendasTotal * comissaoFinal) / 100) * 0.16);

      const novaVenda = {
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

      console.log(novaVenda);
      
      this.comissoesService.setComissao(novaVenda).subscribe(
        (res) => {
          this.showMessageAction('Comissão adicionada com sucesso');
          console.log(res);
          this.loadComissoes();
          this.tabelaVendas._updateChangeSubscription();
          this.closeModalNovaVenda();
        },
        (error) => {
          console.error(`Erro ao inserir a comissão: ${error}`)
        }
      );
    }
  }

  openModalEditarVenda(el: string){}
  openModalDeletarVenda(el: string){}
  closeModalDeletarVenda() {}
  onSubmitDeletarVenda() {}

}
