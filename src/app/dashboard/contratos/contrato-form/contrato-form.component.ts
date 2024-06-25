import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule, AngularEditorConfig } from '@kolkov/angular-editor';
import { Subscription } from 'rxjs';

import { SharedModule } from 'src/app/modules/shared-module/shared-module.module';
import { ContratosService } from '../../../services/contratos.service';
import { AuthService } from 'src/app/services/auth.service';
import { PdfGeneratorService } from 'src/app/services/pdf-generator.service';
import { ClientsService } from 'src/app/services/clients.service';
import { ConfirmModalService } from 'src/app/services/confirm-modal.service';

import { ContratoArquivoComponent } from '../contrato-arquivo/contrato-arquivo.component';
import { ContratoProgressoComponent } from '../contrato-progresso/contrato-progresso.component';
import { ContratoModalpdfComponent } from '../contrato-modal-pdf/contrato-modal-pdf.component';

import { COMPANIES, DEV_SERVICES, DEV_SERVICE_OPTIONS, HELP_SERVICES, HELP_SERVICE_OPTIONS, PROJECT_TYPES, TEAMS } from '../servicos-data-in-memory';
import { type COMPANY, type SERVICE, type PROJECT, type TEAM } from '../types';
import { Contrato } from '../IContrato';
import { nanoid } from 'nanoid';

@Component({
  selector: 'app-contrato-form',
  templateUrl: './contrato-form.component.html',
  styleUrls: ['./contrato-form.component.css'],
  standalone: true,
  imports: [ HttpClientModule, AngularEditorModule, SharedModule, ContratoArquivoComponent, ContratoProgressoComponent, ContratoModalpdfComponent ]
})
export class ContratoFormComponent {
  @ViewChild('contractFormRef') contractForm: NgForm;
  contractToView: Contrato;

  isEditMode: boolean = false;
  contractId: string;
  contratoAutor: string = '';
  contratoStatus: string = 'Minuta contratual';
  contratoServico: string = 'Tecnologia';
  contratoCriadoEm: string;
  contratoAtualizadoEm: string;

  contratoCriado: boolean = false;
  isGeneratingPdf: boolean = false;
  clientAlreadyExist: boolean = true;
  
  progress: number = 0;
  private progressSubscription: Subscription | undefined;
  pdfUrl: string | null = null;
  
  COMPANIES_LIST: COMPANY = COMPANIES;
  TEAMS_LIST: TEAM = TEAMS;
  PROJECT_LIST: PROJECT = PROJECT_TYPES;
  SERVICES_LIST: SERVICE = DEV_SERVICES;
  SERVICES_LIST_OPTIONS: SERVICE = DEV_SERVICE_OPTIONS;

  editorConfig: AngularEditorConfig = {
    editable: true,
    sanitize: true,
    minHeight: '129px',
    placeholder: 'Exemplo',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Poppins',
    defaultFontSize: '1',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'poppins', name: 'Poppins'},
      {class: 'times-new-roman', name: 'Times New Roman'}
    ],
    customClasses: [
      {
        name: 'heading1',
        class: 'h1',
        tag: 'h1',
      },
      {
        name: 'heading2',
        class: 'h2',
        tag: 'h2',
      },
      {
        name: 'heading3',
        class: 'h3',
        tag: 'h3',
      },
      {
        name: 'heading4',
        class: 'h4',
        tag: 'h4',
      },
      {
        name: 'heading5',
        class: 'h5',
        tag: 'h5',
      },
      {
        name: 'heading6',
        class: 'h6',
        tag: 'h6',
      },
      {
        name: 'paragraph',
        class: 'paragraph',
        tag: 'p',
      },
    ],
    toolbarHiddenButtons: [
      ['textColor','backgroundColor', 'link', 'unlink', 'insertImage', 'insertVideo', 'insertHorizontalRule', 'removeFormat', 'toggleEditorMode', 'customClasses', 'removeFormat', 'heading',
    'fontName']
    ]
  };

  constructor(
    private authService: AuthService,
    private contratosService: ContratosService,
    private pdfGeneratorService: PdfGeneratorService,
    private clientsService: ClientsService,
    private confirmModalService: ConfirmModalService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.contratoAutor = this.authService.getUserName();

    this.progressSubscription = this.pdfGeneratorService.progress$.subscribe(progress => {
      this.progress = progress;
    });

    this.route.paramMap.subscribe(params => {
      this.contractId = params.get('id');
      this.isEditMode = !!this.contractId;
      if (this.isEditMode) {
        this.loadContract();
      }
    });
  }

  ngOnDestroy() {
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }
  }

  async loadContract() {
    const contract = await this.contratosService.getContratoById(this.contractId);
    this.contratoAutor = contract.contratoAutor;
    this.contratoStatus = contract.contratoStatus;
    this.contratoServico = contract.contratoServico;
    this.contratoCriadoEm = contract.criadoEm;
    this.contratoAtualizadoEm = contract.atualizadoEm;
    
    this.contractForm.setValue({
      nzGroup: contract.nzGroup,
      extEmpresaGroup: contract.extEmpresaGroup,
      projetoGroup: contract.projetoGroup
    })
  }

  handleServiceTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;

    if(selectElement.value.toLocaleLowerCase().includes('outros')) {
      this.SERVICES_LIST = HELP_SERVICES;
      this.SERVICES_LIST_OPTIONS = HELP_SERVICE_OPTIONS;

    } else {
      this.SERVICES_LIST = DEV_SERVICES;
      this.SERVICES_LIST_OPTIONS = DEV_SERVICE_OPTIONS;
    }
  }

  onInputProjectValue(value: string): void {
    if(value !== null) {
      const projectGroup = this.contractForm.controls['projetoGroup'];

      const valorMulta = Number(value) / 2
      const multa = valorMulta.toFixed(2)
  
      projectGroup.get('projetoMulta').setValue(multa)

      if(this.isEditMode || this.contractForm.value.projetoGroup.projetoParcelas) {
        this.onInputInstallmentsChange(this.contractForm.value.projetoGroup.projetoParcelas)
      }
    }
  }

  onInputInstallmentsChange(installments: string): void {
    if(installments !== null) {
      const projectGroup = this.contractForm.controls['projetoGroup'];
      const projectValue = projectGroup.value.projetoValor
  
      if(projectValue) {
        const installmentValue = Number(projectValue) / Number(installments)
        const installment = installmentValue.toFixed(2)
    
        projectGroup.get('projetoParcelasValor').setValue(installment);
      }
    }
  }

  async onChangeCnpj(cnpj: string) {
    if(cnpj !== null) {
      if(cnpj.length === 14) {
        const client = await this.clientsService.getClientById(cnpj);
  
        const extEmpresaGroup = this.contractForm.controls['extEmpresaGroup'];
        
        if(client !== null && extEmpresaGroup) {
          extEmpresaGroup.get('extEmpresaNome').setValue(client.nome_empresa);
          
          if(client.inscricao_estadual) {
            extEmpresaGroup.get('extEmpresaIE').setValue(client.inscricao_estadual);
          }
  
          extEmpresaGroup.get('extEmpresaEndereco').setValue(client.empresa_endereco);
          extEmpresaGroup.get('extEmpresaBairro').setValue(client.empresa_bairro);
          extEmpresaGroup.get('extEmpresaCEP').setValue(client.empresa_cep);
  
        } else {
          this.clientAlreadyExist = false;
  
          extEmpresaGroup.get('extEmpresaNome').setValue('');
          extEmpresaGroup.get('extEmpresaIE').setValue('');
          extEmpresaGroup.get('extEmpresaEndereco').setValue('');
          extEmpresaGroup.get('extEmpresaBairro').setValue('');
          extEmpresaGroup.get('extEmpresaCEP').setValue('');
        }
      }
    }
  }

  async onConfirmCreate() {
    let generatedId = nanoid();
    generatedId = generatedId.toLocaleLowerCase();

    if(this.contractForm.value.nzGroup.nzEmpresaResponsavel === 'Nairuz') {
      this.contratoServico = 'Marketing';
    }

    const newContrato = {
      contratoId: generatedId,
      contratoAutor: this.contratoAutor,
      contratoStatus: this.contratoStatus,
      contratoServico: this.contratoServico,
      criadoEm: new Date().toLocaleString(),
      ...this.contractForm.value
    }

    // cria novo contrato
    await this.contratosService.createContrato(newContrato);

    // cria novo cliente na base de dados para consultar posteriormente
    const newClient = {
      empresa_cnpj: this.contractForm.value.extEmpresaGroup.extEmpresaCnpj,
      nome_empresa: this.contractForm.value.extEmpresaGroup.extEmpresaNome,
      inscricao_estadual: this.contractForm.value.extEmpresaGroup.extEmpresaIE,
      empresa_endereco: this.contractForm.value.extEmpresaGroup.extEmpresaEndereco,
      empresa_bairro: this.contractForm.value.extEmpresaGroup.extEmpresaBairro,
      empresa_cep: this.contractForm.value.extEmpresaGroup.extEmpresaCEP,
      criado_em: new Date().toLocaleString()
    }
    await this.clientsService.createClient(newClient);
    this.clientAlreadyExist = true;

    await this.generatePdf();

    this.contratoCriado = true
    this.contractForm.resetForm()
  }

  async onConfirmEdit () {
    const editedContract = {
      contratoId: this.contractId,
      contratoAutor: this.contratoAutor,
      contratoStatus: this.contratoStatus,
      contratoServico: this.contratoServico,
      criadoEm: this.contratoCriadoEm,
      atualizadoEm: new Date().toLocaleString(),
      ...this.contractForm.value
    }

    await this.contratosService.editContrato(editedContract)
    await this.generatePdf();

    this.contratoCriado = true

    this.contractForm.resetForm()
  }

  async onContractFormSubmit() {
    if(!this.contractForm.valid) {
      return
    }

    this.contractToView = this.contractForm.value;

    if(this.contractForm.valid) {
      if(this.isEditMode) {
        this.confirmModalService.open(
          'Deseja confirmar a edição dos campos alterados?',
          '',
          () => this.onConfirmEdit()
        )
      } else {
        this.confirmModalService.open(
          'Prosseguir para a criação do contrato?',
          '',
          () => this.onConfirmCreate()
        )
      }
    }
  }

  async generatePdf(): Promise<void> {
    this.isGeneratingPdf = true; // Ativar estado de carregamento,

    const contentIds = [
      'page1', 'page2', 'page3', 'page4',
      'page5', 'page6', 'page7', 'page8',
      'page9', 'page10', 'page11', 'page12',
      'page13', 'page14', 'page15', 'page16',
      'page17', 'page18', 'page19', 'page20',
      'page21', 'page22', 'page23', 'page24']
      ;
    try {
      const pdfBlob = await this.pdfGeneratorService.generatePdf(contentIds);
      if (pdfBlob) {
        this.pdfUrl = URL.createObjectURL(pdfBlob);
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      this.isGeneratingPdf = false; // Desativar estado de carregamento
    }
  }
}
