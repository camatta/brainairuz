import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  users: any[] = [];

  userSectorOptions: { [key: string]: string[] } = {};

  teamOptions: string[] = ['Tecnologia', 'Marketing', 'Administrativo', 'Comercial', 'Customer Success'];

  sectorOptions: { [key: string]: string[] } = {
    Tecnologia: ['Design UX/UI', 'Desenvolvimento'],
    Marketing: ['Design Publicitário', 'Inbound Marketing', 'Mídias Pagas', 'Redação', 'SEO'],
    Administrativo: ['Administrativo', 'Financeiro', 'Recursos Humanos'],
    Comercial: ['Vendas'],
    'Customer Success': ['CS']
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
        console.log(this.users)
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onTeamChange(user: any) {
    user.userSectorOptions = this.sectorOptions[user.team];
  }
}
