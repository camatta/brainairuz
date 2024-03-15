import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AuthService } from 'src/app/services/auth.service';
import { Produtos } from './interfaceProdutos';
import { ProductsService } from 'src/app/services/products.service';


@Component({
  selector: 'app-tabela-valores',
  templateUrl: './tabela-valores.component.html',
  styleUrls: ['./tabela-valores.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe
  ]
})

export class TabelaDeValores implements OnInit {
  displayedColumns: string[] = ['id', 'produto', 'tecnologia', 'valor_venda', 'observacao'];
  produtos: MatTableDataSource<Produtos> = new MatTableDataSource<Produtos>([]);
  msgActions: string;
  ultimoId: number = 0;

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

    this.showAdmin = accessLevel === 'Administrador';

    if(this.showAdmin) {
      this.displayedColumns = ['id', 'produto', 'tecnologia', 'valor_venda', 'observacao', 'actions'];
    } else {
      this.displayedColumns = ['id', 'produto', 'tecnologia', 'valor_venda', 'observacao'];
    }

    // Carrega todos os produtos
    this.loadMatTable();

    // Tradução do Paginator
    this.paginator._intl.itemsPerPageLabel="Itens por página";
    this.paginator._intl.nextPageLabel="Próxima";
    this.paginator._intl.previousPageLabel="Anterior";
    this.paginator._intl.firstPageLabel="Primeira Página";
    this.paginator._intl.lastPageLabel="Última Página";
  }

  loadMatTable() {
    this.productService.getProducts().subscribe(
      (data) => { 
        this.produtos = new MatTableDataSource<Produtos>(data);
        this.produtos.paginator = this.paginator;
        this.produtos.sort = this.sort;
        this.ultimoId = this.produtos.data[this.produtos.data.length - 1].id;
      },
      (err) => { console.error(err) }
    );
  }
  
  // Função para fazer a busca
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.produtos.filter = filterValue.trim().toLowerCase();
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  /* *** Modais de ações *** */

  // CRIAR Produto
  formNovoProduto = this.formBuilder.group({
    id: this.ultimoId + 1,
    produto: ['', Validators.required],
    tecnologia: ['', Validators.required],
    valor_venda: [0, Validators.min(4)],
    observacao: ['']
  })

  openModalNovoProduto() {
    this.formNovoProduto.patchValue({
      id: this.ultimoId + 1
    });

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
        id: this.formNovoProduto.get('id').value,
        produto: this.formNovoProduto.get('produto').value,
        tecnologia: this.formNovoProduto.get('tecnologia').value,
        valor_venda: Number(this.formNovoProduto.get('valor_venda').value),
        observacao: this.formNovoProduto.get('observacao').value
      }
      
      this.productService.setProduct(novoProduto).subscribe(
        (res) => {
          this.showMessageAction('Produto criado com sucesso');
          this.loadMatTable();
          this.produtos._updateChangeSubscription();
          this.closeModalNovoProduto();
        },
        (error) => {
          console.error(`Erro ao criar o produto: ${error}`)
        }
      );
    }

    this.formNovoProduto = this.formBuilder.group({
      id: this.ultimoId + 1,
      produto: ['', Validators.required],
      tecnologia: ['', Validators.required],
      valor_venda: [0, Validators.min(4)],
      observacao: ['']
    })

  }

  // EDITAR produto
  formEditarProduto = this.formBuilder.group({
    _id: [],
    id: [],
    produto: ['', Validators.required],
    tecnologia: ['', Validators.required],
    valor_venda: [0, Validators.min(4)],
    observacao: ['']
  })

  openModalEditarProduto(element: any) {
    const modal = document.getElementById("modalEdit");
    const bgModal = document.getElementById("bg-modal");

    // Busca os valores da linha e insere nos inputs
    this.formEditarProduto.patchValue({
      _id: element._id,
      id: element.id,
      produto: element.produto,
      tecnologia: element.tecnologia,
      valor_venda: element.valor_venda,
      observacao: element.observacao
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
        id: this.formEditarProduto.get('id').value,
        produto: this.formEditarProduto.get('produto').value,
        tecnologia: this.formEditarProduto.get('tecnologia').value,
        valor_venda: Number(this.formEditarProduto.get('valor_venda').value),
        observacao: this.formEditarProduto.get('observacao').value
      }

      this.productService.updateProduct(id, produto).subscribe(
        (res) => {
          this.showMessageAction('Produto alterado com sucesso');
          this.loadMatTable();
          this.produtos._updateChangeSubscription();
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
    produto: ['']
  })
  
  openModalDeletarProduto(element: any) {
    const modal = document.getElementById("modalDeletar");
    const bgModal = document.getElementById("bg-modal");
    if(modal != null){
      modal.style.display = "block";
      bgModal.style.display = "block";
      modal.classList.add("show");
    }

    // Busca os valores da linha
    this.formDeletarProduto.patchValue({
      id: element._id,
      produto: element.produto
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
        this.produtos._updateChangeSubscription();
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
