import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { UsuariosComponent } from './dashboard/usuarios/usuarios.component';
import { PerfilComponent } from './dashboard/perfil/perfil.component';
import { ComercialComponent } from './dashboard/comercial/comercial.component';
import { AuthGuard } from './routes/auth.guard';
import { RedefinirSenhaComponent } from './redefinir-senha/redefinir-senha.component';
import { IcpComponent } from './dashboard/icp/icp.component';
import { TabelaDeValores } from './dashboard/tabela-valores/tabela-valores.component';
import { TabelaMetasComponent } from './dashboard/tabela-metas/tabela-metas.component';
import { CalculoComissaoComponent } from './dashboard/calculo-comissao/calculo-comissao.component';
import { ContratosComponent } from './dashboard/contratos/contratos.component';
import { ContratoFormComponent } from './dashboard/contratos/contrato-form/contrato-form.component';
import { ContratosListarComponent } from './dashboard/contratos/contratos-listar/contratos-listar.component';
import { ContratosIndexComponent } from './dashboard/contratos/contratos-index/contratos-index.component';
import { ContratoArquivoComponent } from './dashboard/contratos/contrato-arquivo/contrato-arquivo.component';
import { AdicionarOportunidadeComponent } from './dashboard/adicionar-oportunidade/adicionar-oportunidade.component';
import { MixProdutosComponent } from './dashboard/mix-produtos/mix-produtos.component';
import { ControleGeralComponent } from './dashboard/controle-geral/controle-geral.component';
import { MetaEmpresaComponent } from './dashboard/meta-empresa/meta-empresa.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
    { path: 'usuarios', component: UsuariosComponent },
    { path: 'perfil', component: PerfilComponent },
    { path: 'comercial', component: ComercialComponent },
    { path: 'contratos', component:  ContratosComponent, children: [
      { path: '', component: ContratosIndexComponent },
      { path: 'criar', component: ContratoFormComponent },
      { path: 'editar/:id', component: ContratoFormComponent },
      { path: 'listar', component: ContratosListarComponent },
      { path: 'arquivo', component: ContratoArquivoComponent },
    ]},
    { path: 'adicionar-oportunidade', component: AdicionarOportunidadeComponent },
    { path: 'icp', component: IcpComponent },
    { path: 'mix-produtos', component: MixProdutosComponent },
    { path: 'tabela-valores', component: TabelaDeValores },
    { path: 'tabela-metas', component: TabelaMetasComponent },
    { path: 'meta-empresa', component: MetaEmpresaComponent },
    { path: 'calculo-comissao', component: CalculoComissaoComponent },
    { path: 'adicionar-oportunidade', component: AdicionarOportunidadeComponent },
    { path: 'controle-geral', component: ControleGeralComponent },
  ]},
  { path: 'cadastro', component: CadastroComponent },
  { path: 'redefinir-senha', component: RedefinirSenhaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
