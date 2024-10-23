import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { ContractsService } from '../../../services/contracts.service';
import { ConfirmModalService } from 'src/app/services/confirm-modal.service';
import { PdfGeneratorService } from 'src/app/services/pdf-generator.service';

import { AdvancedFilterPipe } from './advanced-filter.pipe';
import { ContratoArquivoComponent } from '../contrato-arquivo/contrato-arquivo.component';
import { ContratoProgressoComponent } from '../contrato-progresso/contrato-progresso.component';
import { ContratoModalpdfComponent } from '../contrato-modal-pdf/contrato-modal-pdf.component';
import { SpinnerComponent } from 'src/app/ui/loader/spinner.component';

import { type Contract } from '../contract.model';
import { type Author } from '../author.model';

@Component({
  selector: 'app-contratos-listar',
  templateUrl: './contratos-listar.component.html',
  styleUrls: ['./contratos-listar.component.css'],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    AdvancedFilterPipe,
    ContratoArquivoComponent,
    ContratoProgressoComponent,
    ContratoModalpdfComponent,
    SpinnerComponent,
  ],
  standalone: true,
})
export class ContratosListarComponent {
  isFetching: boolean = true;
  CONTRATOS: Contract[] = [];
  AUTHORS: Author[] = [];

  progress: number = 0;
  private progressSubscription: Subscription | undefined;
  pdfUrl: string | null = null;
  isLoadingPdf: boolean = false;
  isContractReady: boolean;
  contractToView: Contract;

  searchClient: string = '';
  searchAuthor: string = '';
  searchStatus: string = '';

  constructor(
    private contractsService: ContractsService,
    private confirmModalService: ConfirmModalService,
    private router: Router,
    private pdfGeneratorService: PdfGeneratorService
  ) {}

  ngOnInit() {
    this.contractsService.getContracts().subscribe({
      next: ({ contracts }) => {
        this.CONTRATOS = contracts;
        this.isFetching = false;
      },
      error: (err) => {
        alert(`Algo deu errado ao carregar os contratos!\n${err}`);
        this.isFetching = false;
      },
    });

    this.progressSubscription = this.pdfGeneratorService.progress$.subscribe(
      (progress) => {
        this.progress = progress;
      }
    );

    this.contractsService.getAuthors().subscribe({
      next: ({ authors }) => {
        if (authors) {
          authors.map((author) => {
            this.AUTHORS.push(author);
          });
        }
      },
      error: (err) => {
        alert(`Algo deu errado ao carregar usuários!\n${err}`);
      },
    });
  }

  ngOnDestroy() {
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }
  }

  onDelete(id: string) {
    // Find the item index
    const contractIndex = this.CONTRATOS.findIndex(({ _id }) => _id === id);

    // Store the item for rollback
    const contractToDelete = this.CONTRATOS[contractIndex];

    // Optimistically remove the item from the UI
    this.CONTRATOS.splice(contractIndex, 1);

    // Send the delete request to the server
    this.contractsService.deleteContract(id).subscribe({
      next: (response) => {
        //console.log('Item deleted successfully', response);
      },
      error: (error) => {
        // Rollback the UI change
        this.CONTRATOS.splice(contractIndex, 0, contractToDelete);

        // Optionally, notify the user
        alert(`Algo deu errado ao excluir o contrato!.\n${error}`);
      },
    });
  }

  onEdit(id: string) {
    this.router.navigate(['/dashboard/contratos/editar', id]);
  }

  onChangeContractStatus(id: string, newStatus: string) {
    // Find the item index
    const contractIndex = this.CONTRATOS.findIndex(({ _id }) => _id === id);

    // Store the item for rollback
    const contractOldStatus = this.CONTRATOS[contractIndex].contratoStatus;
    this.CONTRATOS[contractIndex].contratoStatus = newStatus;

    this.contractsService.editContractStatus(id, newStatus).subscribe({
      next: (response) => {
        //console.log(response);
      },
      error: (error) => {
        // Rollback the UI change
        this.CONTRATOS[contractIndex].contratoStatus = contractOldStatus;
        // Optionally, notify the user
        alert(`Algo deu errado ao atualizar o status do contrato!.\n${error}`);
      },
    });
  }

  returnPreviousStatus(id: string) {
    const contractIndex = this.CONTRATOS.findIndex(({ _id }) => _id === id);

    this.contractsService.getContractById(id).subscribe({
      next: ({ contract }) => {
        this.CONTRATOS[contractIndex] = contract;
        this.CONTRATOS = [...this.CONTRATOS]; // Cria uma nova referência para forçar a atualização no Angular
      },
      error: (err) => {
        alert(`Algo deu errado ao desfazer alteração!\n${JSON.stringify(err)}`);
      },
    });
  }

  confirmEdit(contrato: Contract) {
    this.confirmModalService.open(
      `Deseja prosseguir com a edição do contrato “${contrato.extEmpresaGroup.extEmpresaNome}”?`,
      '',
      () => this.onEdit(contrato._id)
    );
  }

  confirmStatusChange(id: string, event: Event, actualStatus: string) {
    const element = event.target as HTMLSelectElement;
    const newStatus = element.value;

    this.confirmModalService.open(
      `Deseja alterar o status de “${actualStatus}” para “${newStatus}”?`,
      `Alteração realizada com sucesso!`,
      () => this.onChangeContractStatus(id, newStatus),
      () => this.returnPreviousStatus(id)
    );
  }

  confirmDelete(id: string, clientName: string) {
    this.confirmModalService.open(
      `Prosseguir para a exclusão do contrato “${clientName}”?`,
      'Exclusão realizada com sucesso!',
      () => this.onDelete(id)
    );
  }

  async onViewContract(contract: Contract) {
    this.isContractReady = false;
    this.progress = 0;
    this.isLoadingPdf = true; // Ativar estado de carregamento,
    this.contractToView = contract;

    setTimeout(async () => {
      try {
        const contractDefaultPagesIds = [
          'page1',
          'page2',
          'page3',
          'page4',
          'page5',
          'page6',
          'page7',
          'page8',
          'page9',
          'page10',
          'page11',
          'page12',
          'page13',
          'page14',
        ];
        let contractAddPagesIds = [];

        const nzTipoProjeto = this.contractToView.nzGroup.nzTipoProjeto;
        const nzServico = this.contractToView.nzGroup.nzServico;

        if (
          nzTipoProjeto === 'Projeto' &&
          nzServico.toLowerCase().includes('personalizado')
        ) {
          contractAddPagesIds = [
            'page16',
            'page17',
            'page18',
            'page19',
            'page20',
            'page21',
            'page22',
            'page23',
            'page24',
          ];
        }

        if (
          nzTipoProjeto === 'Recorrência' &&
          nzServico.toLowerCase().includes('help a')
        ) {
          contractAddPagesIds = ['page25'];
        }

        if (
          nzTipoProjeto === 'Projeto' &&
          nzServico.toLowerCase().includes('api')
        ) {
          contractAddPagesIds = [
            'page26',
            'page27',
            'page28',
            'page29',
            'page30',
            'page31',
            'page32',
            'page33',
            'page34',
            'page35',
            'page36',
            'page37',
          ];
        }

        if (
          nzTipoProjeto === 'Projeto' &&
          nzServico.toLowerCase().includes('blog')
        ) {
          contractAddPagesIds = [
            'page38',
            'page40',
            'page41',
            'page42',
            'page43',
          ];
        }

        if (
          nzTipoProjeto === 'Projeto' &&
          nzServico.toLowerCase().includes('marca')
        ) {
          contractAddPagesIds = ['page44', 'page45', 'page46'];
        }

        if (
          nzTipoProjeto === 'Projeto' &&
          nzServico.toLowerCase().includes('onepage')
        ) {
          contractAddPagesIds = [
            'page51',
            'page52',
            'page53',
            'page54',
            'page55',
            'page56',
          ];
        }

        if (
          nzTipoProjeto === 'Recorrência' &&
          nzServico.toLowerCase().includes('horas')
        ) {
          contractAddPagesIds = [
            'page57',
            'page58',
            'page59',
            'page60',
            'page61',
          ];
        }

        if (
          nzTipoProjeto === 'Projeto' &&
          nzServico.toLowerCase().includes('tema')
        ) {
          contractAddPagesIds = [
            'page62',
            'page63',
            'page64',
            'page65',
            'page66',
            'page67',
            'page68',
            'page69',
            'page70',
          ];
        }

        if (
          nzTipoProjeto === 'Projeto' &&
          nzServico.toLowerCase().includes('website')
        ) {
          contractAddPagesIds = [
            'page71',
            'page72',
            'page73',
            'page74',
            'page75',
            'page76',
          ];
        }
        contractAddPagesIds.push('page15'); //página Demais informações, inserida ao final de todos contratos

        const contractPagesIds =
          contractDefaultPagesIds.concat(contractAddPagesIds);

        const pdfBlob = await this.pdfGeneratorService.generatePdf(
          contractPagesIds
        );
        if (pdfBlob) {
          this.pdfUrl = URL.createObjectURL(pdfBlob);
          this.isContractReady = true;
        }
      } catch (error) {
        console.error('Erro ao gerar PDF:', error);
      } finally {
        this.isLoadingPdf = false; // Desativar estado de carregamento
      }
    }, 100);
  }
}
