import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Table } from 'primeng/table';

import { SharedModule } from 'src/app/modules/shared-module/shared-module.module';

import { AuthService } from 'src/app/services/auth.service';
import { Produtos } from './interfaceProdutos';
import { ProductsService } from 'src/app/services/products.service';

interface DadosTransformados {
  produto: string;
  itens: {
    tipoProduto: string;
    tecnologia_servico: string;
    mrr: number;
    tipo_mrr: string;
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
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private productService: ProductsService
  ) {}

  displayedColumns: string[] = ['id', 'produto', 'tecnologia_servico', 'mrr', 'valor_venda', 'observacao'];
  produtos = [];
  msgActions: string;
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: Produtos | null;
  tipoProduto: string = 'Projeto';

  // validação de usuários
  showAdmin = false;

  ngOnInit(): void {
    const user = this.authService.getUser();
    const accessLevel = user ? user.accessLevel : '';

    this.showAdmin = accessLevel === 'Administrador' || user.name === 'Adriany Oliveira';

    if(this.showAdmin) {
      this.displayedColumns = ['id', 'produto', 'tecnologia_servico', 'valor_venda', 'observacao', 'actions'];
    } else {
      this.displayedColumns = ['id', 'produto', 'tecnologia_servico', 'valor_venda', 'observacao'];
    }

    // Carrega todos os produtos
    this.loadMatTable();
  }

  loadMatTable() {
    this.productService.getProducts().subscribe(
      (data) => { 
        this.produtos = this.transformarDados(data);
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
          itens: [
            {
              tipoProduto: item.tipoProduto,
              tecnologia_servico: item.tecnologia_servico ? item.tecnologia_servico : 'N/A',
              mrr: item.mrr ? item.mrr : 'N/A',
              tipo_mrr: item.tipo_mrr ? item.tipo_mrr : '',
              variantes: [{ _id: item._id, valorVenda: item.valor_venda, observacao: item.observacao }]
            }
          ]
        });
      } else {
        const indiceTecnologia = dadosTransformados[indiceProduto].itens.findIndex(
          itemTecnologia => itemTecnologia.tecnologia_servico === item.tecnologia_servico
        );
  
        if (indiceTecnologia === -1) {
          dadosTransformados[indiceProduto].itens.push({
            tipoProduto: item.tipoProduto,
            tecnologia_servico: item.tecnologia_servico ? item.tecnologia_servico : 'N/A',
            mrr: item.mrr ? item.mrr : 'N/A',
            tipo_mrr: item.tipo_mrr ? item.tipo_mrr : '',
            variantes: [{ _id: item._id, valorVenda: item.valor_venda, observacao: item.observacao }]
          });
        } else {
          dadosTransformados[indiceProduto].itens[indiceTecnologia].variantes.push({
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

  // Recupera o valor do select e passa para a variável, para mostrar a tecnologia do produto ou meses (mrr)
  verificaTipoProduto(el: any) {
    this.tipoProduto = el.target.value;
  }

  /* *** Modais de ações *** */
  // Criar Produto
  formNovoProduto = this.formBuilder.group({
    produto: ['', Validators.required],
    tipoProduto: ['', Validators.required],
    tecnologia_servico: ['', Validators.required],
    mrr: [0], // Revisar o validador
    tipo_mrr: [''], // Revisar o validador
    valor_venda: [0], // Revisar o validador
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

    this.formNovoProduto = this.formBuilder.group({
      produto: ['', Validators.required],
      tipoProduto: ['', Validators.required],
      tecnologia_servico: ['', Validators.required],
      mrr: [0], // Verificar validação
      tipo_mrr: [''], // Revisar o validador
      valor_venda: [0, Validators.required],
      observacao: ['']
    })
  }
  
  onSubmitNovoProduto() {
    this.formNovoProduto.updateValueAndValidity();
    const formNovoProdutoStatus: string = this.formNovoProduto.status;

    if(formNovoProdutoStatus !== "INVALID") {
      const novoProduto: Produtos = {
        produto: this.formNovoProduto.get('produto').value,
        tipoProduto: this.formNovoProduto.get('tipoProduto').value,
        tecnologia_servico: this.formNovoProduto.get('tecnologia_servico').value,
        mrr: this.formNovoProduto.get('mrr').value,
        tipo_mrr: this.formNovoProduto.get('tipo_mrr').value,
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
      tipoProduto: ['', Validators.required],
      tecnologia_servico: ['', Validators.required],
      mrr: [0], // Revisar o validador
      tipo_mrr: [''], // Revisar o validador
      valor_venda: [0, Validators.required],
      observacao: ['']
    })

  }

  // EDITAR produto
  formEditarProduto = this.formBuilder.group({
    _id: [],
    produto: ['', Validators.required],
    tipoProduto: ['', Validators.required],
    tecnologia_servico: ['', Validators.required],
    mrr: [0], // Revisar o validador
    tipo_mrr: [''], // Revisar o validador
    valor_venda: [0], // Revisar o validador
    observacao: ['']
  })

  openModalEditarProduto(produto: any, item: any, variante: any) {
    const modal = document.getElementById("modalEdit");
    const bgModal = document.getElementById("bg-modal");

    // Busca os valores da linha e insere nos inputs
    this.formEditarProduto.patchValue({
      _id: variante._id,
      produto: produto.produto,
      tipoProduto: item.tipoProduto,
      tecnologia_servico: item.tecnologia_servico,
      mrr: item.mrr == 'N/A' ? 0 : item.mrr,
      tipo_mrr: item.tipo_mrr == '' ? '' : item.tipo_mrr,
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
        tipoProduto: this.formEditarProduto.get('tipoProduto').value,
        tecnologia_servico: this.formEditarProduto.get('tecnologia_servico').value,
        mrr: this.formEditarProduto.get('mrr').value,
        tipo_mrr: this.formEditarProduto.get('tipo_mrr').value,
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
    tipoProduto: [''],
    tecnologia_servico: [''],
    mrr: [0],
    tipo_mrr: [''],
  })
  
  openModalDeletarProduto(produto: any, item: any, variante: any) {
    const modal = document.getElementById("modalDeletar");
    const bgModal = document.getElementById("bg-modal");
    if(modal != null){
      modal.style.display = "block";
      bgModal.style.display = "block";
      modal.classList.add("show");
    }

    // Busca os valores da linha
    this.formDeletarProduto.patchValue({
      id: variante._id,
      produto: produto.produto,
      tipoProduto: item.tipoProduto,
      tecnologia_servico: item.tecnologia_servico,
      mrr: item.mrr,
      tipo_mrr: item.tipo_mrr
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
