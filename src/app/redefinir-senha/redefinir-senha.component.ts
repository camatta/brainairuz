import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css']
})

export class RedefinirSenhaComponent {
  redefinirSenhaForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.redefinirSenhaForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.redefinirSenhaForm.valid) {
      const email = this.redefinirSenhaForm.value.email;

      this.authService.solicitarRedefinicaoSenha(email).subscribe(
        (response) => {
          console.log(response); // Lidar com a resposta do backend (pode ser um sucesso ou erro)
        },
        (error) => {
          console.error(error); // Lidar com erros de solicitação
        }
      );
    }
  }
}