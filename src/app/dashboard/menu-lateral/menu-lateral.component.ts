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
  showAvaliacoesLink = false;
  showUsuariosLink = false;
  showComercialLink = false;
  showTabelaPrecos = false;
  showTabelaDeValores = false;
  linkAtivo: string;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    this.linkAtivo = this.router.url;

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.linkAtivo = this.router.url;
    });
  }

  ngOnInit(): void {
    const user = this.authService.getUser();
    const accessLevel = user ? user.accessLevel : '';
    const team = user ? user.team : '';
    const name = user ? user.name : '';

    this.showAvaliacoesLink =
      accessLevel === 'Líder de Equipe' ||
      accessLevel === 'Administrador';
    
    this.showUsuariosLink =
      accessLevel === 'Líder de Equipe' ||
      accessLevel === 'Administrador';

    this.showTabelaPrecos =
      accessLevel === 'Administrador' ||
      team === 'Comercial' ||
      team === 'Customer Success' ||
      name === 'Adriany Oliveira' ||
      name === 'Beatriz Cruz Alves';

    this.showComercialLink =
      accessLevel === 'Administrador' ||
      accessLevel === 'Líder de Equipe' ||
      team === 'Comercial' ||
      name === 'Luccas Baptista' ||
      name === 'Beatriz Cruz Alves' ||
      name === 'Beatriz Almeida';

    this.showTabelaDeValores = accessLevel === 'Administrador';
      // accessLevel === 'Administrador' ||
      // team === 'Comercial' ||
      // name === 'Adriany Oliveira';
  }

  isLinkAtivo(link: string): boolean {
    return this.linkAtivo === link;
  }

  logout(): void {
    this.authService.clearUserData();
    this.router.navigate(['/']);
  }
}
