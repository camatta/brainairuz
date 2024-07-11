import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared-module/shared-module.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MixProdutosService } from 'src/app/services/mixProdutos.service';

@Component({
  selector: 'app-mix-produtos',
  templateUrl: './mix-produtos.component.html',
  styleUrls: ['./mix-produtos.component.css'],
  standalone: true,
  imports: [ SharedModule ]
})

export class MixProdutosComponent implements OnInit {
  displayedColumns: string[] = ['actions', 'mixProduto'];
  msgActions: string;
  tabelaMixProdutos: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private _liveAnnouncer: LiveAnnouncer,
    private formBuilder: FormBuilder,
    private mixProdutosService: MixProdutosService,
  ){}

  ngOnInit(): void {

    this.loadMixesProdutos();

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

  loadMixesProdutos() {
    this.mixProdutosService.getMixProdutos().subscribe(
      async data => this.tabelaMixProdutos = new MatTableDataSource<any>(data)
    )
  }

  /** Announce the change in sort state for assistive technology. */
   announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // MODAL de ação dos produtos
  showMessageAction(message: string) {
    const toast: HTMLElement = document.querySelector("#alert-actions");
    this.msgActions = message;
    setTimeout(() => toast.classList.add('show'), 700);
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // CRIANDO NOVO MIX DE PRODUTO
  formNovoMixProduto = this.formBuilder.group({
    mixProduto: ['', Validators.required]
  })

  openModalNovoMixProduto(){
    const modal = document.getElementById("modalNew");
    const bgModal = document.getElementById("bg-modal");

    if(modal != null){
      modal.style.display = "block";
      bgModal.style.display = "block";
      modal.classList.add("show");
    }
  }

  closeModalNovoMixProduto(){
    const modal = document.getElementById("modalNew");
    const bgModal = document.getElementById("bg-modal");

    if(modal != null){
      modal.style.display = "none";
      bgModal.style.display = "none";
      modal.classList.remove("show");
    }
  }

  onSubmitNovoMixProduto(){
    this.formNovoMixProduto.updateValueAndValidity();
    const formNovoMixProdutoStatus: string = this.formNovoMixProduto.status;

    if(formNovoMixProdutoStatus !== "INVALID") {
      let value = this.formNovoMixProduto.get('mixProduto').value;
      let mixProduto = { mixProduto: value };
      
      this.mixProdutosService.setMixProduto(mixProduto).subscribe(
        async (res) => {
          this.showMessageAction("Mix de produto adicionado com sucesso");
          await this.loadMixesProdutos();
          this.tabelaMixProdutos._updateChangeSubscription();
          this.closeModalNovoMixProduto();
        }, async (error) => {
          console.error(`Componente: Erro ao criar o Mix de Produto: ${error}`);
          this.showMessageAction('ERRO ao criar o Mix de Produto');
          await this.loadMixesProdutos();
          this.tabelaMixProdutos._updateChangeSubscription();
          this.closeModalNovoMixProduto();
        }
      )
    }
  }

  // EDITANDO MIX DE PRODUTO
  formEditarMixProduto = this.formBuilder.group({
    _id: [],
    mixProduto: ['', Validators.required]
  })
  openModalEditarMixProduto(element: any){
    const modal = document.getElementById("modalEdit");
    const bgModal = document.getElementById("bg-modal");

    // Busca os valores da linha e insere nos inputs
    this.formEditarMixProduto.patchValue({
      _id: element._id,
      mixProduto: element.mixProduto,
    })

    if(modal != null){
      modal.style.display = "block";
      bgModal.style.display = "block";
      modal.classList.add("show");
    }
  }
  closeModalEditarMixProduto(){
    const modal = document.getElementById("modalEdit");
    const bgModal = document.getElementById("bg-modal");
    if(modal != null){
      modal.style.display = "none";
      bgModal.style.display = "none";
      modal.classList.remove("show");
    }
  }
  onSubmitEditarMixProduto(){
    this.formEditarMixProduto.updateValueAndValidity();
    const formEditarMixProdutoStatus: string = this.formEditarMixProduto.status;

    if(formEditarMixProdutoStatus !== "INVALID") {
      let id = this.formEditarMixProduto.get('_id').value;
      let value = this.formEditarMixProduto.get('mixProduto').value;
      let mixProduto = { mixProduto: value };
      
      this.mixProdutosService.updateMixProduto(mixProduto, id).subscribe(
        async (res) => {
          this.showMessageAction("Mix de produto editado com sucesso");
          await this.loadMixesProdutos();
          this.tabelaMixProdutos._updateChangeSubscription();
          this.closeModalEditarMixProduto();
        }, async (error) => {
          console.error(`Componente: Erro ao editar o Mix de Produto: ${error}`);
          this.showMessageAction('ERRO ao editar o Mix de Produto');
          await this.loadMixesProdutos();
          this.tabelaMixProdutos._updateChangeSubscription();
          this.closeModalEditarMixProduto();
        }
      )
    }
  }

  // DELETANDO MIX DE PRODUTO
  formDeletarMixProduto = this.formBuilder.group({
    _id: [],
    mixProduto: ['']
  })
  openModalDeletarMixProduto(element: any){
    const modal = document.getElementById("modalDeletar");
    const bgModal = document.getElementById("bg-modal");
    if(modal != null){
      modal.style.display = "block";
      bgModal.style.display = "block";
      modal.classList.add("show");
    }

    // Busca os valores da linha
    this.formDeletarMixProduto.patchValue({
      _id: element._id,
      mixProduto: element.mixProduto
    })
  }
  closeModalDeletarMixProduto(){
    const modal = document.getElementById("modalDeletar");
    const bgModal = document.getElementById("bg-modal");
    if(modal != null){
      modal.style.display = "none";
      bgModal.style.display = "none";
      modal.classList.remove("show");
    }
  }
  onSubmitDeletarMixProduto(){
    let id = this.formDeletarMixProduto.get('_id').value;

    this.mixProdutosService.deleteMixProduto(id).subscribe(
      async (res) => {
        this.showMessageAction("Mix de produto excluído com sucesso");
        await this.loadMixesProdutos();
        this.tabelaMixProdutos._updateChangeSubscription();
        this.closeModalDeletarMixProduto();
      }, async (error) => {
        console.error(`Componente: Erro ao excluir o Mix de Produto: ${error}`);
        this.showMessageAction('ERRO ao excluir o Mix de Produto');
        await this.loadMixesProdutos();
        this.tabelaMixProdutos._updateChangeSubscription();
        this.closeModalDeletarMixProduto();
      }
    )
  }
}
