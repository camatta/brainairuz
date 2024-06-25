import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { ContratosService } from '../../../services/contratos.service';
import { AdvancedFilterPipe } from './advanced-filter.pipe';
import { ConfirmModalService } from 'src/app/services/confirm-modal.service';
import { Contrato } from '../IContrato';
import { ContratoArquivoComponent } from '../contrato-arquivo/contrato-arquivo.component';
import { PdfGeneratorService } from 'src/app/services/pdf-generator.service';
import { ContratoProgressoComponent } from '../contrato-progresso/contrato-progresso.component';
import { ContratoModalpdfComponent } from '../contrato-modal-pdf/contrato-modal-pdf.component';

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
    ContratoModalpdfComponent
  ],
  standalone: true
})
export class ContratosListarComponent {
  CONTRATOS: Contrato[] = [];
  
  progress: number = 0;
  private progressSubscription: Subscription | undefined;
  pdfUrl: string | null = null;
  isLoadingPdf: boolean = false;
  isContractReady: boolean;
  contractToView: Contrato;

  searchClient:string = '';
  searchAuthor:string = '';
  searchStatus:string= '';

  constructor(private contratosService: ContratosService, private confirmModalService: ConfirmModalService, private router: Router, private pdfGeneratorService: PdfGeneratorService) {}

  ngOnInit() {
    this.CONTRATOS = this.contratosService.getContratos();

    this.progressSubscription = this.pdfGeneratorService.progress$.subscribe(progress => {
      this.progress = progress;
    });
  }

  ngOnDestroy() {
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }
  }

  onDelete(id: string) {
    this.contratosService.deleteContrato(id)
    this.CONTRATOS = this.contratosService.getContratos()
  }

  onEdit(id: string) {
    this.router.navigate(['/dashboard/contratos/editar', id]);
  }

  onChangeContractStatus(id: string, newStatus: string) {   
    this.contratosService.editContratoStatus(id, newStatus);

    this.CONTRATOS = this.contratosService.getContratos()
  }
  returnPreviousStatus(id: string, status: string) {
    this.contratosService.editContratoStatus(id, status);

    this.CONTRATOS = this.contratosService.getContratos()
  }

  confirmEdit(contrato: Contrato) {
    this.confirmModalService.open(
      `Deseja prosseguir com a edição do contrato “${contrato.extEmpresaGroup.extEmpresaNome}”?`,
      '',
      () => this.onEdit(contrato.contratoId)
    )
  }

  confirmStatusChange(id: string, event: Event, actualStatus: string) {
    event.preventDefault()
    const element = event.target as HTMLSelectElement;
    const newStatus = element.value;

    this.confirmModalService.open(
      `Deseja alterar o status de “${actualStatus}” para “${newStatus}”?`,
      `Alteração realizada com sucesso!`,
      () => this.onChangeContractStatus(id, newStatus),
      () => this.returnPreviousStatus(id, actualStatus)
    )
  }

  confirmDelete(id: string, clientName: string) {
    this.confirmModalService.open(
      `Prosseguir para a exclusão do contrato “${clientName}”?`,
      'Exclusão realizada com sucesso!',
      () => this.onDelete(id)
    )
  }

  async onViewContract(contract: Contrato) {
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
