import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
})
export class CadastroComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient) {}

  cadastrar(): void {
    const userData = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.http.post('/api/auth/cadastro', userData)
      .subscribe(
        response => {
          console.log(response);
          // Redirecionar ou exibir mensagem de sucesso, por exemplo
        },
        error => {
          console.error(error);
          // Exibir mensagem de erro
        }
      );
  }
}
