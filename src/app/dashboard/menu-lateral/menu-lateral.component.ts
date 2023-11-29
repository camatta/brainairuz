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

    this.showAvaliacoesLink = accessLevel === 'Líder de Equipe' || accessLevel === 'Administrador';
    this.showUsuariosLink = accessLevel === 'Líder de Equipe' || accessLevel === 'Administrador';
    this.showComercialLink = team === 'Comercial' || accessLevel === 'Administrador';
  }

  isLinkAtivo(link: string): boolean {
    return this.linkAtivo === link;
  }

  logout(): void {
    this.authService.clearUserData();
    this.router.navigate(['/']);
  }
}
