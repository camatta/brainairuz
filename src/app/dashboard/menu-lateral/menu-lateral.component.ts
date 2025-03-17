import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})

export class MenuLateralComponent implements OnInit {
  showUsuariosLink = false;
  showComercialLink = false;
  showContratos = false;
  showTabelaPrecos = false;
  showMixProdutos = false;
  showTabelaDeValores = false;
  showTabelaDeMetas = false;
  showMetaEmpresa = false;
  showCalculoComissao = false;
  showSubmenu: boolean = false
  showAdicionarOportunidade = false;
  showControleGeral = false;
  linkAtivo: string;


  master: boolean = false;
  liderCs: boolean = false;
  comercial: boolean = false;
  cs: boolean = false;
  exception: boolean = false;
  todos: boolean = false;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    this.linkAtivo = this.router.url;

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.linkAtivo = this.router.url;
    });
  }

  ngOnInit(): void {
    const elementos = Array.from(document.querySelectorAll(".collapse"));
    elementos.forEach((elemento) => {
      elemento.classList.remove("show");
    })

    const user = this.authService.getUser();
    const accessLevel = user ? user.accessLevel : '';
    const team = user ? user.team : '';
    const name = user ? user.name : '';
    const setor = user ? user.setor : '';

    this.master = accessLevel === 'Administrador' || name === 'Valeria Queiroz';
    this.liderCs = team === 'Customer Success' && accessLevel === 'Líder de Equipe';
    this.comercial = team === 'Comercial';
    this.cs = setor === 'CS' || setor === 'CSTec' || team === 'Customer Success';

    this.exception = name === 'Matheus Silva';

    this.todos = this.master || this.liderCs || this.comercial || this.cs;
  }

  collapseMenu(element: any) {
    const elemento = element.target.parentElement.querySelector(".collapse");
    const arrow = element.target.querySelector(".fa-chevron-down");

    if(elemento.classList.contains("show")) {
      elemento.classList.remove("show");
      arrow.style.transform = "rotate(0deg)";
    } else {
      elemento.classList.add("show");
      arrow.style.transform = "rotate(180deg)";
    }
  }

  isLinkAtivo(link: string): boolean {
    return this.linkAtivo === link;
  }

  handleSubmenu() {
    this.showSubmenu = !this.showSubmenu
  }

  logout(): void {
    this.authService.clearUserData();
    this.router.navigate(['/']);
  }
}
