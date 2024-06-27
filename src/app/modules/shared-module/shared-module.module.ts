import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Biblioteca: Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// Biblioteca: Prime NG
import { ButtonModule } from 'primeng/button';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

// Services
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/products.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonToggleModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ButtonModule
  ],
  providers: [LiveAnnouncer, ProductsService, AuthService],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonToggleModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ButtonModule
  ]
})
export class SharedModule { }
