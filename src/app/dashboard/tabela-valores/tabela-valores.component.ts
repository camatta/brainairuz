import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Table } from 'primeng/table';

import { SharedModule } from 'src/app/modules/shared-module/shared-module.module';

import { AuthService } from 'src/app/services/auth.service';
import { Produtos } from './interfaceProdutos';
import { ProductsService } from 'src/app/services/products.service';

interface DadosTransformados {
  produto: string;
  tecnologias: {
    tecnologia: string;
    variantes: {
      _id: string;
      valorVenda: number;
      observacao: string;
    }[];
  }[];
}


@Component({
  selector: 'app-tabela-valores',
  templateUrl: './tabela-valores.component.html',
  styleUrls: ['./tabela-valores.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [ SharedModule ]
})

export class TabelaDeValores implements OnInit {
  displayedColumns: string[] = ['id', 'produto', 'tecnologia', 'valor_venda', 'observacao'];
  // produtos: MatTableDataSource<Produtos> = new MatTableDataSource<Produtos>([]);
  produtos = [];
  msgActions: string;
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: Produtos | null;
  termoBusca: any;

  // validação de usuários
  showAdmin = false;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private _liveAnnouncer: LiveAnnouncer,
    private formBuilder: FormBuilder,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    const accessLevel = user ? user.accessLevel : '';

    this.showAdmin = accessLevel === 'Administrador' || user.name === 'Adriany Oliveira';

    if(this.showAdmin) {
      this.displayedColumns = ['id', 'produto', 'tecnologia', 'valor_venda', 'observacao', 'actions'];
    } else {
      this.displayedColumns = ['id', 'produto', 'tecnologia', 'valor_venda', 'observacao'];
    }

    // Carrega todos os produtos
    this.loadMatTable();
  }

  loadMatTable() {
    this.productService.getProducts().subscribe(
      (data) => { 
        this.produtos = this.transformarDados(data);
        console.log(this.produtos);
      },
      (err) => { console.error(err) }
    );
  }

  transformarDados(dados: any[]): DadosTransformados[] {
    const dadosTransformados: DadosTransformados[] = [];
  
    dados.forEach(item => {
      const indiceProduto = dadosTransformados.findIndex(
        itemTransformado => itemTransformado.produto === item.produto
      );
  
      if (indiceProduto === -1) {
        dadosTransformados.push({
          produto: item.produto,
          tecnologias: [
            {
              tecnologia: item.tecnologia,
              variantes: [{ _id: item._id, valorVenda: item.valor_venda, observacao: item.observacao }]
            }
          ]
        });
      } else {
        const indiceTecnologia = dadosTransformados[indiceProduto].tecnologias.findIndex(
          itemTecnologia => itemTecnologia.tecnologia === item.tecnologia
        );
  
        if (indiceTecnologia === -1) {
          dadosTransformados[indiceProduto].tecnologias.push({
            tecnologia: item.tecnologia,
            variantes: [{ _id: item._id, valorVenda: item.valor_venda, observacao: item.observacao }]
          });
        } else {
          dadosTransformados[indiceProduto].tecnologias[indiceTecnologia].variantes.push({
            _id: item._id,
            valorVenda: item.valor_venda,
            observacao: item.observacao
          });
        }
      }
    });
  
    return dadosTransformados;
  }

  // Função para fazer a busca
  inputBusca(el: any, table: Table) {
    table.filterGlobal(el.target.value, 'contains');
  }

  // Função para limpar os filtros
  clear(table: Table) {
    table.clear();
  }

  /* *** Modais de ações *** */
  // Criar Produto
  formNovoProduto = this.formBuilder.group({
    produto: ['', Validators.required],
    tecnologia: ['', Validators.required],
    valor_venda: [0, Validators.required],
    observacao: ['']
  })

  openModalNovoProduto() {
    const modal = document.getElementById("modalNew");
    const bgModal = document.getElementById("bg-modal");

    if(modal != null){
      modal.style.display = "block";
      bgModal.style.display = "block";
      modal.classList.add("show");
    }
  }

  closeModalNovoProduto() {
    const modal = document.getElementById("modalNew");
    const bgModal = document.getElementById("bg-modal");
    if(modal != null){
      modal.style.display = "none";
      bgModal.style.display = "none";
      modal.classList.remove("show");
    }
  }
  
  onSubmitNovoProduto() {
    this.formNovoProduto.updateValueAndValidity();
    const formNovoProdutoStatus: string = this.formNovoProduto.status;

    if(formNovoProdutoStatus !== "INVALID") {
      const novoProduto: Produtos = {
        produto: this.formNovoProduto.get('produto').value,
        tecnologia: this.formNovoProduto.get('tecnologia').value,
        valor_venda: Number(this.formNovoProduto.get('valor_venda').value),
        observacao: this.formNovoProduto.get('observacao').value
      }
      
      this.productService.setProduct(novoProduto).subscribe(
        (res) => {
          this.showMessageAction('Produto criado com sucesso');
          this.loadMatTable();
          this.closeModalNovoProduto();
        },
        (error) => {
          console.error(`Erro ao criar o produto: ${error}`);
          this.showMessageAction('ERRO ao criar o produto');
          this.loadMatTable();
          this.closeModalNovoProduto();
        }
      );
    }

    this.formNovoProduto = this.formBuilder.group({
      produto: ['', Validators.required],
      tecnologia: ['', Validators.required],
      valor_venda: [0, Validators.required],
      observacao: ['']
    })

  }

  // EDITAR produto
  formEditarProduto = this.formBuilder.group({
    _id: [],
    produto: ['', Validators.required],
    tecnologia: ['', Validators.required],
    valor_venda: [0, Validators.required],
    observacao: ['']
  })

  openModalEditarProduto(produto: any, tecnologia: any, variante: any) {
    const modal = document.getElementById("modalEdit");
    const bgModal = document.getElementById("bg-modal");

    // Busca os valores da linha e insere nos inputs
    this.formEditarProduto.patchValue({
      _id: produto._id,
      produto: produto.produto,
      tecnologia: tecnologia.tecnologia,
      valor_venda: variante.valorVenda,
      observacao: variante.observacao
    })

    if(modal != null){
      modal.style.display = "block";
      bgModal.style.display = "block";
      modal.classList.add("show");
    }
  }

  closeModalEditarProduto() {
    const modal = document.getElementById("modalEdit");
    const bgModal = document.getElementById("bg-modal");
    if(modal != null){
      modal.style.display = "none";
      bgModal.style.display = "none";
      modal.classList.remove("show");
    }
  }

  onSubmitEdit() {
    this.formEditarProduto.updateValueAndValidity();
    const formEditarProdutoStatus: string = this.formEditarProduto.status;
    
    if(formEditarProdutoStatus !== "INVALID") {
      const id: string = this.formEditarProduto.get('_id').value;
      const produto: Produtos = {
        produto: this.formEditarProduto.get('produto').value,
        tecnologia: this.formEditarProduto.get('tecnologia').value,
        valor_venda: Number(this.formEditarProduto.get('valor_venda').value),
        observacao: this.formEditarProduto.get('observacao').value
      }

      this.productService.updateProduct(id, produto).subscribe(
        (res) => {
          this.showMessageAction('Produto alterado com sucesso');
          this.loadMatTable();
          this.closeModalEditarProduto();
        },
        (error) => {
          console.error(`Erro ao editar o produto: ${error}`);
        }
      );
    }
  }

  // DELETAR Produto
  formDeletarProduto = this.formBuilder.group({
    id: [],
    produto: [''],
    tecnologia: ['']
  })
  
  openModalDeletarProduto(produto: any, tecnologia: any) {
    const modal = document.getElementById("modalDeletar");
    const bgModal = document.getElementById("bg-modal");
    if(modal != null){
      modal.style.display = "block";
      bgModal.style.display = "block";
      modal.classList.add("show");
    }

    // Busca os valores da linha
    this.formDeletarProduto.patchValue({
      id: produto._id,
      produto: produto.produto,
      tecnologia: tecnologia.tecnologia
    })
  }

  closeModalDeletarProduto() {
    const modal = document.getElementById("modalDeletar");
    const bgModal = document.getElementById("bg-modal");
    if(modal != null){
      modal.style.display = "none";
      bgModal.style.display = "none";
      modal.classList.remove("show");
    }
  }

  onSubmitDeletarProduto() {
    const id: string = this.formDeletarProduto.get('id').value;
    this.productService.deleteProduct(id).subscribe(
      (res) => {
        this.showMessageAction('Produto excluído com sucesso');
        this.loadMatTable();
        this.closeModalDeletarProduto();
      },
      (error) => {
        console.error(`Erro ao excluir o produto: ${error}`)
      }
    );
  }

  // MODAL de ação dos produtos
  showMessageAction(message: string) {
    const toast: HTMLElement = document.querySelector("#alert-actions");
    this.msgActions = message;
    setTimeout(() => toast.classList.add('show'), 700);
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

}
