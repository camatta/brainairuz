import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { type User, UserService } from 'src/app/services/user.service';
import { ContractsService } from '../../../services/contracts.service';
import { ConfirmModalService } from 'src/app/services/confirm-modal.service';
import { PdfGeneratorService } from 'src/app/services/pdf-generator.service';

import { Contract } from '../contract.model';
import { AdvancedFilterPipe } from './advanced-filter.pipe';
import { ContratoArquivoComponent } from '../contrato-arquivo/contrato-arquivo.component';
import { ContratoProgressoComponent } from '../contrato-progresso/contrato-progresso.component';
import { ContratoModalpdfComponent } from '../contrato-modal-pdf/contrato-modal-pdf.component';
import { SpinnerComponent } from 'src/app/ui/loader/spinner.component';

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
    SpinnerComponent
  ],
  standalone: true
})
export class ContratosListarComponent {
  isFetching: boolean = true;
  CONTRATOS: Contract[] = [];
  AUTHORS: User[] = [];
  
  progress: number = 0;
  private progressSubscription: Subscription | undefined;
  pdfUrl: string | null = null;
  isLoadingPdf: boolean = false;
  isContractReady: boolean;
  contractToView: Contract;

  searchClient:string = '';
  searchAuthor:string = '';
  searchStatus:string= '';

  constructor(
    private contractsService: ContractsService,
    private confirmModalService: ConfirmModalService,
    private router: Router,
    private pdfGeneratorService: PdfGeneratorService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.contractsService.getContracts().subscribe({
      next: ({ contracts }) => {
        this.CONTRATOS = contracts;
        this.isFetching = false;
      },
      error: err => {
        alert(`Algo deu errado ao carregar os contratos!\n${err}`);
        this.isFetching = false;
      }
    });

    this.progressSubscription = this.pdfGeneratorService.progress$.subscribe(progress => {
      this.progress = progress;
    });

    this.userService.getUsers().subscribe({
      next: ({ users }) => {
        if(users) {
          users.map(user => {
            if(user.team === "Comercial") {
              this.AUTHORS.push(user);
            }
          });
        }
      },
      error: err => {
        alert(`Algo deu errado ao carregar usuários!\n${err}`);
      }
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
      next: response => {
        //console.log('Item deleted successfully', response);
      },
      error: error => {
        // Rollback the UI change
        this.CONTRATOS.splice(contractIndex, 0, contractToDelete);

        // Optionally, notify the user
        alert(`Algo deu errado ao excluir o contrato!.\n${error}`);
      }
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
      next: response => {
        //console.log(response);
      },
      error: error => {
        // Rollback the UI change
        this.CONTRATOS[contractIndex].contratoStatus = contractOldStatus;
         // Optionally, notify the user
         alert(`Algo deu errado ao atualizar o status do contrato!.\n${error}`);
      }
    });
  }

  returnPreviousStatus() {
    this.contractsService.getContracts().subscribe({
      next: ({ contracts }) => {
        this.CONTRATOS = contracts;
      }
    });
  }

  confirmEdit(contrato: Contract) {
    this.confirmModalService.open(
      `Deseja prosseguir com a edição do contrato “${contrato.extEmpresaGroup.extEmpresaNome}”?`,
      '',
      () => this.onEdit(contrato._id)
    )
  }

  confirmStatusChange(id: string, event: Event, actualStatus: string) {
    const element = event.target as HTMLSelectElement;
    const newStatus = element.value;

    this.confirmModalService.open(
      `Deseja alterar o status de “${actualStatus}” para “${newStatus}”?`,
      `Alteração realizada com sucesso!`,
      () => this.onChangeContractStatus(id, newStatus),
      () => this.returnPreviousStatus()
    )
  }

  confirmDelete(id: string, clientName: string) {
    this.confirmModalService.open(
      `Prosseguir para a exclusão do contrato “${clientName}”?`,
      'Exclusão realizada com sucesso!',
      () => this.onDelete(id)
    )
  }

  async onViewContract(contract: Contract) {
    this.isContractReady = false;
    this.progress = 0;
    this.isLoadingPdf = true; // Ativar estado de carregamento,
    this.contractToView = contract;

    setTimeout( async () => {
      try {
        const contentIds = [
          'page1', 'page2', 'page3', 'page4',
          'page5', 'page6', 'page7', 'page8',
          'page9', 'page10', 'page11', 'page12',
          'page13', 'page14', 'page15', 'page16',
          'page17', 'page18', 'page19', 'page20',
          'page21', 'page22', 'page23', 'page24'
        ];
  
        const pdfBlob = await this.pdfGeneratorService.generatePdf(contentIds);
        if (pdfBlob) {
          this.pdfUrl = URL.createObjectURL(pdfBlob);
          this.isContractReady = true
        }
      } catch (error) {
        console.error('Erro ao gerar PDF:', error);
      } finally {
        this.isLoadingPdf = false; // Desativar estado de carregamento
      }
    }, 100);
  }
}
