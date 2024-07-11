import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// Biblioteca: Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


// Biblioteca: Prime NG
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

// Biblioteca: NGX Mask
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
    TableModule,
    ToastModule,
    ButtonModule,
    MatProgressSpinnerModule
  ],
  providers: [ LiveAnnouncer, ProductsService, AuthService ],
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
    TableModule,
    ToastModule,
    ButtonModule,
    MatProgressSpinnerModule
  ]
})
export class SharedModule { }
