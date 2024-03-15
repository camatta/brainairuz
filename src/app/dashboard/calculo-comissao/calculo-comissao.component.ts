import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { startWith, map } from 'rxjs/operators';

import { Produtos } from '../tabela-valores/interfaceProdutos';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-calculo-comissao',
  templateUrl: './calculo-comissao.component.html',
  styleUrls: ['./calculo-comissao.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatInputModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule
  ]
})

export class CalculoComissaoComponent {
  selectedValue: string;
  selectedCar: string;

  produtos: Produtos[] = [];
  produtosFiltrados: any[] = [];
  controlSelect = new FormControl();
  selectFilterControl = new FormControl();

  constructor(private productService: ProductsService){}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (data) => { this.produtos = data },
      (err) => { console.error(err) }
    )

    this.produtosFiltrados = this.produtos.slice();
    this.selectFilterControl.valueChanges.pipe(
      startWith(null), map((nome: string | null) => nome ? this._filtrarOpcoes(nome) : this.produtos.slice())
    ).subscribe(
      produtosFiltrados => this.produtosFiltrados = produtosFiltrados
    );
  }

  private _filtrarOpcoes(valor: string): string[] {
    const filtroValor = valor.toLowerCase();
    return this.produtosFiltrados.filter(opcao => opcao.toLowerCase().includes(filtroValor));
  }

  // VERIFICAR O PORQUE NÃO ESTÁ CARREGANDO OS PRODUTOS

}
