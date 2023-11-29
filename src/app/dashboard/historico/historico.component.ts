import { Component, OnInit } from '@angular/core';
import { AvaliacoesService } from 'src/app/services/avaliacoes.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import jsPDF from 'jspdf';


@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit {
  historicoAvaliacoes: any[] = [];
  nomeUsuario: string = this.authService.getUserName(); // Nome do usuário para obter o histórico de avaliações
  isAuthorized: boolean = false; // Propriedade para controlar a autorização do usuário
  users: any[] = []; // Lista de usuários para o select
  liderTeam: string = '';
  filteredUsers: any[] = [];
  isAdmin: boolean = false;
  exibirDetalhes = false;

  constructor(private avaliacoesService: AvaliacoesService, private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.checkAuthorization();
    this.getUsers();
    this.getHistoricoAvaliacoes();
  }

  checkAuthorization(): void {
    const accessLevel = this.authService.getAccessLevel(); // Método para obter o nível de acesso do usuário
    if (accessLevel === 'Administrador') {
      this.isAuthorized = true;
    } else if (accessLevel === 'Líder de Equipe') {
      this.isAuthorized = true;
      const userLogadoJSON = localStorage.getItem('user');
      if (userLogadoJSON) {
        const userLogado = JSON.parse(userLogadoJSON);
        this.liderTeam = userLogado.team;
      }
    }
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(
      (users: any[]) => {
        if (this.isAuthorized && this.authService.getAccessLevel() === 'Líder de Equipe') {
          // Filtrar os usuários para exibir somente os do mesmo time do líder
          this.filteredUsers = users.filter(user => user.team === this.liderTeam);
        } else {
          this.filteredUsers = users;
        }
        this.removeDevTesteUser(); // Remover o usuário "Dev Nairuz" da listagem
        this.sortUsersAlphabetically(); // Ordenar os usuários em ordem alfabética
      },
      (error: any) => {
        console.error('Erro ao obter lista de usuários', error);
      }
    );
  }

  removeDevTesteUser(): void {
    this.filteredUsers = this.filteredUsers.filter(user => user.name !== 'Dev Nairuz');
  }

  sortUsersAlphabetically(): void {
    this.filteredUsers.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }

  getHistoricoAvaliacoes(nomeUsuario?: string): void {
    if (this.isAuthorized) {
      // Verifica se foi fornecido um nome de usuário, caso contrário, usa o nome do usuário selecionado no select
      const usuario = nomeUsuario ? nomeUsuario : this.nomeUsuario;
      
      // Lógica para obter histórico de avaliações do usuário selecionado
      this.avaliacoesService.getHistoricoAvaliacoesPorUsuario(usuario).subscribe(
        (historicoAvaliacoes: any[]) => {
          this.historicoAvaliacoes = historicoAvaliacoes;
          console.log(historicoAvaliacoes);
        },
        (error: any) => {
          console.error('Erro ao obter histórico de avaliações', error);
        }
      );
    } else {
      // Lógica para obter o histórico de avaliações apenas para o usuário logado
      const usuarioLogado = this.authService.getUserName();
      this.avaliacoesService.getHistoricoAvaliacoesPorUsuario(usuarioLogado).subscribe(
        (historicoAvaliacoes: any[]) => {
          this.historicoAvaliacoes = historicoAvaliacoes;
          console.log(historicoAvaliacoes);
        },
        (error: any) => {
          console.error('Erro ao obter histórico de avaliações', error);
        }
      );
    }
  }


//   downloadRelatorio(avaliacao: any) {
//     // Crie uma nova instância do jsPDF
//     const doc = new jsPDF();
  
//     const logoPath = '../../../assets/images/logo-nairuz-colorido.png';

//     // Carregar o logo SVG
//     const logoWidth = 40; // Largura do logo SVG no PDF
//     const logoHeight = 8; // Altura do logo SVG no PDF
//     doc.addImage(logoPath,'PNG', 10, 10, logoWidth, logoHeight);

//     doc.text('Avaliação de Desempenho', 80, 18);

//     function addTableCell(doc: jsPDF, text: string, x: number, y: number, width: number, height: number) {
//       doc.setFillColor(0, 187, 185); // Cor de fundo azul (RGB)
//       doc.setTextColor(255, 255, 255); // Cor do texto branco (RGB)
//       doc.setDrawColor(0, 0, 0); // Cor da borda preta (RGB)
    
//       doc.rect(x, y, width, height, 'FD')
    
//       const fontSize = doc.getFontSize(); // Obtém o tamanho da fonte
//       const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
//       const textX = x + (width - textWidth) / 2;
//       const textY = y + height / 2 + fontSize / 4; // Ajusta a posição vertical para o centro da célula
//       doc.text(text, textX, textY);
//     }

//     addTableCell(doc, `Nome do Funcionário: ${avaliacao.funcionario}`, 10, 30, 190, 10);
//     addTableCell(doc, `Avaliado por: ${avaliacao.avaliador}`, 10, 40, 190, 10);
//     addTableCell(doc, `Data da Avaliação: ${avaliacao.dataFormatada}`, 10, 50, 190, 10);
//     addTableCell(doc, `Nota Individual: ${avaliacao.mediaIndividual}`, 10, 60, 190, 10);
//     addTableCell(doc, `Nota do Time: ${avaliacao.mediaTime}`, 10, 70, 190, 10);
//     addTableCell(doc, `Nota da Empresa: ${avaliacao.mediaEmpresa}`, 10, 80, 190, 10);
//     addTableCell(doc, `Média Final: ${avaliacao.mediaFinalGeral}`, 10, 90, 190, 10);


//     function addFormattedText(doc: jsPDF, text: string, x: number, y: number, fontSize: number) {
//       const textLines = doc.splitTextToSize(text, 220); // Divide o texto em linhas para ajustar ao width de 220
    
//       doc.setTextColor(0, 0, 0); // Cor do texto preto (RGB)
//       doc.setFontSize(fontSize);
    
//       doc.text(textLines, x, y);
//     }
//     const formattedText = `
// Critérios:

// 1. Para receber as bonificações* é necessário ter nota individual no mínimo de 9,0 em duas avaliações
// consecutivas e absenteísmo "Muito Bom";
// Notas:
//  a) Se o colaborador obter nota maior ou igual a 9,0 e o absenteísmo for "Bom", receberá a
// bonificação da Performance Ouro;
//  b) Caso o colaborador tenha nota maior ou igual a 9,0 porém o absenteísmo for "Regular" ou
// "Insatisfatório", não receberá as bonificações.
// *As bonificações estão atreladas ao fluxo de caixa da empresa, ou seja, mesmo o funcionário tendo uma
// performance Ouro ou Diamante, só será bonificado mediante a aprovação do Financeiro.

// 2. Para ser promovido é necessário ter nota individual e média no mínimo de 9,0 em quatro avaliações
// consecutivas;

// 3. Peso = 5 - empresa/ 3 - individual/ 2 - time;

// 4. Se a empresa não atingiu o resultados, não segue com a promoção;

// 5. Promoção de 25% de colaboradores por time, se houver e programado com o Financeiro, considerando a
// seguinte ordem:
//  a) Colaborador com maior nota;
//  b) Em caso de empate na pontuação, o colaborador que tiver maior tempo de contratação (não
// considerando o tempo de estágio).

// 6. Definição de performance individual:
//  a) Nota 0 até 6,99 = Prata
//  b) Nota entre 7 e 8,99 = Ouro
//  c) Nota igual ou maior que 9 = Diamante

// 7. Absenteísmo:
//  a) Insatisfatório: Falta não programada e/ou falta não justificada. Obs.: Se o colaborador tiver banco de
// horas e não programar a ausência, receberá esta avaliação;
//  b) Regular: Dois atrasos ou mais na semana e/ou acima de um atestado no mês (equivalente até um
// dia);
//  c) Bom: Um atraso e/ou um atestado no mês (equivalente até um dia);
//  d) Muito bom: zero absenteísmo.`;

//     addFormattedText(doc, formattedText, 10, 100, 12);
//     // doc.text('Lista de Notas:', 10, 190);
    
//     // // Verificar se há espaço suficiente na página atual
//     // const availableSpace = doc.internal.pageSize.height - 200; // Espaço disponível após a adição dos primeiros elementos
  
//     // // Definir a altura máxima para a lista de notas
//     // const maxListHeight = availableSpace - 40; // 40 é a altura estimada dos outros elementos
  
//     // // Verificar se há espaço suficiente para a lista de notas
//     // if (maxListHeight > 0) {
//     //   // Continuar adicionando o conteúdo
//     //   doc.setFontSize(10);
  
//     //   // Lista de Notas
//     //   let posY = 120; // Posição inicial para a lista de notas
//     //   const itemsPerPage = Math.floor(maxListHeight / 10); // Quantidade máxima de itens por página
  
//     //   avaliacao.notas.forEach((item: any, index: number) => {
//     //     if (index % itemsPerPage === 0 && index !== 0) {
//     //       // Adicionar nova página
//     //       doc.addPage();
//     //       posY = 10; // Reiniciar a posição para a nova página
//     //     }
//     //     doc.text(`${item.nome}  -  ${item.requisito}  -  ${item.avaliacao}  -  ${item.nota}`, 10, posY);
//     //     posY += 10;
//     //   });
  
//     //   // Adicionar campos para as assinaturas
//     //   const posYAssinaturas = posY + 20;
//     //   doc.text('Assinatura do Funcionário:', 10, posYAssinaturas);
//     //   doc.text('Assinatura do Avaliador:', 100, posYAssinaturas);
//     // }
  
//     // Gerar e baixar o PDF
//     doc.save('relatorio.pdf');

//   }
  
}
