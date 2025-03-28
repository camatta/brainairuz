import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared-module/shared-module.module';
import { Router } from '@angular/router';

import { FormBuilder, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { OportunidadesService } from 'src/app/services/oportunidades.service';

import { Oportunidade } from 'src/app/types/oportunidade';

@Component({
  selector: 'app-adicionar-oportunidade',
  templateUrl: './adicionar-oportunidade.component.html',
  styleUrls: ['./adicionar-oportunidade.component.css'],
  standalone: true,
  imports: [ SharedModule ]
})

export class AdicionarOportunidadeComponent implements OnInit {
  constructor(
    private users: UserService,
    private auth: AuthService,
    private oportunidades: OportunidadesService,
    private route: Router,
    private formBuilder: FormBuilder,
  ){}

  ngOnInit(): void {
    // Carrega os vendedores para o select do front
    this.loadVendedores();
  }

  vendedores: any[] = [];
  tituloModal: string = "";
  mensagemModal: string = "";
  opCriada: boolean = false;

  // Carrega todos os vendedores
  loadVendedores() {
    // Carrega vendedores do time Comercial
    this.users.getUsers().subscribe(
      async(data: any) => {
        data.users.map((user: any) => {
          if(user.team == "Comercial") {
            this.vendedores.push(user.name);
          }
        })
      }, (err) => {
        console.error("Erro ao carregar time comercial: ", err);
      }
    )
  }

  formAdicionarOportunidade = this.formBuilder.group({
    data: [new Date(), Validators.required],
    suspect: ['', Validators.required],
    origem: ['', Validators.required],
    fonte: ['', Validators.required],
    responsavel: ['', Validators.required]
  });

  openModal(titulo: string, mensagem: string) {
    const modal = document.getElementById("modal");
    const bgModal = document.getElementById("bg-modal");

    if(modal != null){
      this.tituloModal = titulo;
      this.mensagemModal = mensagem;
      modal.style.display = "block";
      bgModal.style.display = "block";
      modal.classList.add("show");
    }
  }

  closeModal() {
    const modal = document.getElementById("modal");
    const bgModal = document.getElementById("bg-modal");

    if(modal != null){
      modal.style.display = "none";
      bgModal.style.display = "none";
      modal.classList.remove("show");
      this.tituloModal = "";
      this.mensagemModal = "";
    }

    if(this.opCriada) {
      this.formAdicionarOportunidade = this.formBuilder.group({
        data: [new Date(), Validators.required],
        suspect: ['', Validators.required],
        origem: ['', Validators.required],
        fonte: ['', Validators.required],
        responsavel: ['', Validators.required]
      });
    }
  }

  redirectControle() {
    this.route.navigate(['/dashboard/controle-geral']);
  }

  // Função que define o mês da venda de acordo com a data passada pelo cliente
  defineMes(mes: string) {
    switch(mes) {
      case "01":
        return "Janeiro";
      case "02":
        return "Fevereiro";
      case "03":
        return "Março";
      case "04":
        return "Abril";
      case "05":
        return "Maio";
      case "06":
        return "Junho";
      case "07":
        return "Julho";
      case "08":
        return "Agosto";
      case "09":
        return "Setembro";
      case "10":
        return "Outubro";
      case "11":
        return "Novembro";
      case "12":
        return "Dezembro";
      default:
        return "Erro no mês enviado";
    }
  }

  adicionarOportunidade() {
    this.formAdicionarOportunidade.updateValueAndValidity();
    const formAdicionarOportunidadeStatus: string = this.formAdicionarOportunidade.status;

    if(formAdicionarOportunidadeStatus !== "INVALID") {
      let data = this.formAdicionarOportunidade.get('data').value;
      let suspect = this.formAdicionarOportunidade.get('suspect').value;
      let origem = this.formAdicionarOportunidade.get('origem').value;
      let fonte = this.formAdicionarOportunidade.get('fonte').value;
      let responsavel = this.formAdicionarOportunidade.get('responsavel').value;
      
      //Formatando data
      let dataApenasData = String(data).split("T")[0];	
      let dataSeparada = dataApenasData.split("-");
      let mes = this.defineMes(dataSeparada[1]);
      let ano = dataSeparada[0];

      if(mes == "Erro no mês enviado") {
        this.openModal("Erro ao criar a oportunidade", "Data inválida. Tente novamente!");
        this.opCriada = false;
        return;
      }

      const novaOportunidade: Oportunidade = {
        data: new Date(data),
        ano: ano,
        mes: mes,
        suspect: suspect,
        origem: origem,
        fonte: fonte,
        responsavel: responsavel,
        primeiro_contato: null,
        status: "Exploratória",
        reuniao_agendada: null,
        sla_atendimento: null,
        percentual_fit: null,
        perfil_cliente: null,
        etapa: null,
        produto: null,
        detalhes_produto: null,
        valor_proposta: null,
        motivo_perda: null,
        valor_vendido: null,
        markup: null,
        mrr: null,
        data_aceite: null,
        ciclo_venda: null,
        mes_encerramento: null
      }

      this.oportunidades.setOportunidade(novaOportunidade).subscribe(
        async (res) => {
          console.log(res);
          console.log(novaOportunidade);
          this.opCriada = true;
          this.openModal(
            "Oportunidade criada com sucesso!",
            "Você já pode visualizá-la na página de Controle."
          );
        },
        async (error) => {
          this.opCriada = false;
          this.openModal(
            "Erro ao criar a oportunidade",
            error
          );
          console.log(novaOportunidade);
          console.error(`Erro ao criar a oportunidade: ${error}`);
        }
      );
    }
  }
}
