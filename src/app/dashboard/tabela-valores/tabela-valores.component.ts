import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

import { PRODUTOS } from './produtos/produtos';
import { Produtos } from './produtos/interfaceProdutos';


@Component({
  selector: 'app-tabela-valores',
  templateUrl: './tabela-valores.component.html',
  styleUrls: ['./tabela-valores.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe
  ]
})

export class TabelaDeValores implements AfterViewInit {
  displayedColumns: string[] = ['id', 'produto', 'tecnologia', 'valor_venda', 'observacao', 'actions'];
  dataSource = new MatTableDataSource<Produtos>(PRODUTOS); // para fazer a busca, preciso passar para este componente uma nova base de dados onde contenham apenas os itens da busca.

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _liveAnnouncer: LiveAnnouncer, private formBuilder: FormBuilder) {}

  ngOnInit() {
    // Tradução do Paginator
    this.paginator._intl.itemsPerPageLabel="Itens por página";
    this.paginator._intl.nextPageLabel="Próxima";
    this.paginator._intl.previousPageLabel="Anterior";
    this.paginator._intl.firstPageLabel="Primeira Página";
    this.paginator._intl.lastPageLabel="Última Página";
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  // EDITAR produto
  formEditarProduto = this.formBuilder.group({
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
  
  formEditarProdutoStatus: string = this.formEditarProduto.status;

  onSubmitEdit() {
    if(this.formEditarProdutoStatus !== "INVALID") {
      const editarProduto: Produtos = {
        id: this.formEditarProduto.get('id').value,
        produto: this.formEditarProduto.get('produto').value,
        tecnologia: this.formEditarProduto.get('tecnologia').value,
        valor_venda: Number(this.formEditarProduto.get('valor_venda').value),
        observacao: this.formEditarProduto.get('observacao').value
      }
  
      // this.dataSource.data.push(editarProduto);
      this.dataSource._updateChangeSubscription();
      this.closeModalEditarProduto();
  
      console.warn(this.formEditarProduto.value);
    }
  }

  // CRIAR Produto
  formNovoProduto = this.formBuilder.group({
    produto: ['', Validators.required],
    tecnologia: ['', Validators.required],
    valor_venda: [0, Validators.min(4)],
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

  formNovoProdutoStatus: string = this.formNovoProduto.status;

  onSubmitNovoProduto() {
    if(this.formNovoProdutoStatus !== "INVALID") {
      const novoProduto: Produtos = {
        id: this.dataSource.filteredData.length + 1,
        produto: this.formNovoProduto.get('produto').value,
        tecnologia: this.formNovoProduto.get('tecnologia').value,
        valor_venda: Number(this.formNovoProduto.get('valor_venda').value),
        observacao: this.formNovoProduto.get('observacao').value
      }
  
      // this.dataSource.data.push(novoProduto);
      this.dataSource._updateChangeSubscription();
      this.closeModalNovoProduto();
  
      console.warn(this.formNovoProduto.value);
    }
  }

  // DELETAR Produto
  formDeletarProduto = this.formBuilder.group({
    produto: [''],
    tecnologia: [''],
    valor_venda: [],
    observacao: ['']
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
      produto: element.produto,
      tecnologia: element.tecnologia,
      valor_venda: element.valor_venda,
      observacao: element.observacao
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
    this.closeModalDeletarProduto();
  }

}
