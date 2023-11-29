import { Component } from '@angular/core';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  userName: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
  }

  isHomePage(): boolean {
    return this.router.url === '/dashboard';
  }
}
