import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { LoginComponent } from './login/login.component';
import { MenuLateralComponent } from './dashboard/menu-lateral/menu-lateral.component';
import { UsuariosComponent } from './dashboard/usuarios/usuarios.component';
import { AvaliacoesComponent } from './dashboard/avaliacoes/avaliacoes.component';
import { PerfilComponent } from './dashboard/perfil/perfil.component';
import { HistoricoComponent } from './dashboard/historico/historico.component';
import { ComercialComponent } from './dashboard/comercial/comercial.component';
import { PiramideComponent } from './dashboard/piramide/piramide.component';
import { IcpComponent } from './dashboard/icp/icp.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [
    AppComponent,
    CadastroComponent,
    DashboardComponent,
    LoginComponent,
    MenuLateralComponent,
    UsuariosComponent,
    AvaliacoesComponent,
    PerfilComponent,
    HistoricoComponent,
    ComercialComponent,
    PiramideComponent,
    IcpComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    provideNgxMask()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
