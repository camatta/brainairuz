import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideNgxMask } from 'ngx-mask';


import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { LoginComponent } from './login/login.component';
import { MenuLateralComponent } from './dashboard/menu-lateral/menu-lateral.component';
import { UsuariosComponent } from './dashboard/usuarios/usuarios.component';
import { PerfilComponent } from './dashboard/perfil/perfil.component';
import { ComercialComponent } from './dashboard/comercial/comercial.component';
import { RedefinirSenhaComponent } from './redefinir-senha/redefinir-senha.component';
import { IcpComponent } from './dashboard/icp/icp.component';
import { AdicionarOportunidadeComponent } from './dashboard/adicionar-oportunidade/adicionar-oportunidade.component';

@NgModule({
  declarations: [
    AppComponent,
    CadastroComponent,
    DashboardComponent,
    LoginComponent,
    MenuLateralComponent,
    UsuariosComponent,
    PerfilComponent,
    ComercialComponent,
    RedefinirSenhaComponent,
    IcpComponent,
    AdicionarOportunidadeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideNgxMask()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
