import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule, AngularEditorConfig } from '@kolkov/angular-editor';
import { Subscription } from 'rxjs';

import { SharedModule } from 'src/app/modules/shared-module/shared-module.module';
import { ContractsService } from '../../../services/contracts.service';
import { AuthService } from 'src/app/services/auth.service';
import { PdfGeneratorService } from 'src/app/services/pdf-generator.service';
import { ClientsService } from 'src/app/services/clients.service';
import { ConfirmModalService } from 'src/app/services/confirm-modal.service';

import { ContratoArquivoComponent } from '../contrato-arquivo/contrato-arquivo.component';
import { ContratoProgressoComponent } from '../contrato-progresso/contrato-progresso.component';
import { ContratoModalpdfComponent } from '../contrato-modal-pdf/contrato-modal-pdf.component';

import { DEV_COMMERCE_SERVICES, DEV_COMMERCE_OPTIONS, HELP_SERVICES, PROJECT_TYPES, TEAMS, DEV_INST_OPTIONS, DEV_INST_SERVICES } from '../servicos-data-in-memory';
import { type SERVICE, type PROJECT, type TEAM } from '../types';
import { Contract } from '../contract.model';
import { nanoid } from 'nanoid';
import { type CEP, ViaCepService } from 'src/app/services/via.cep.service';

@Component({
  selector: 'app-contrato-form',
  templateUrl: './contrato-form.component.html',
  styleUrls: ['./contrato-form.component.css'],
  standalone: true,
  imports: [ HttpClientModule, AngularEditorModule, SharedModule, ContratoArquivoComponent, ContratoProgressoComponent, ContratoModalpdfComponent ]
})
export class ContratoFormComponent {
  @ViewChild('contractFormRef') contractForm: NgForm;
  contractToView: Contract;
  isFetching: boolean = false;

  isEditMode: boolean = false;
  contractMongo_id: string;
  contractId: string;
  contratoAutor: string = '';
  contratoStatus: string = 'Minuta contratual';
  contratoEmpresa: string = 'NZTEC';
  contratoTime: string = 'Tecnologia';
  contratoCriadoEm: string;
  contratoAtualizadoEm: string;

  contratoCriado: boolean = false;
  isGeneratingPdf: boolean = false;
  clientAlreadyExist: boolean = true;
  
  progress: number = 0;
  private progressSubscription: Subscription | undefined;
  pdfUrl: string | null = null;
  
  TEAMS_LIST: TEAM = TEAMS;
  PROJECT_LIST: PROJECT = PROJECT_TYPES;
  SERVICES_LIST: SERVICE = DEV_COMMERCE_SERVICES;
  SERVICES_LIST_OPTIONS: SERVICE = DEV_COMMERCE_OPTIONS;

  editorConfig: AngularEditorConfig = {
    editable: true,
    sanitize: true,
    minHeight: '260px',
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
      ['undo', 'redo','textColor','backgroundColor', 'link', 'unlink', 'insertImage', 'insertVideo', 'insertHorizontalRule', 'removeFormat', 'toggleEditorMode', 'customClasses', 'removeFormat', 'heading', 'indent', 'outdent', 'fontName']
    ]
  };

  constructor(
    private authService: AuthService,
    private contractsService: ContractsService,
    private pdfGeneratorService: PdfGeneratorService,
    private clientsService: ClientsService,
    private confirmModalService: ConfirmModalService,
    private route: ActivatedRoute,
    private viaCepService: ViaCepService
  ) {}

  ngOnInit() {
    this.contratoAutor = this.authService.getUserName();

    this.progressSubscription = this.pdfGeneratorService.progress$.subscribe(progress => {
      this.progress = progress;
    });

    this.route.paramMap.subscribe(params => {
      this.contractMongo_id = params.get('id');
      this.isEditMode = !!this.contractMongo_id;
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
    this.isFetching = true;
    this.contractsService.getContractById(this.contractMongo_id).subscribe({
      next: ({ contract }) => {
      this.contractId = contract.contratoId,
      this.contratoAutor = contract.contratoAutor;
      this.contratoStatus = contract.contratoStatus;
      this.contratoEmpresa = contract.contratoEmpresa;
      this.contratoTime = contract.contratoTime;
      this.contratoCriadoEm = contract.contratoCriadoEm
      this.contratoAtualizadoEm = contract.contratoAtualizadoEm;
      
      this.contractForm.setValue({
        nzGroup: contract.nzGroup,
        extEmpresaGroup: contract.extEmpresaGroup,
        projetoGroup: contract.projetoGroup
      });

      this.isFetching = false;
    },
    error: err => {
      this.isFetching = false;
      alert(`Algo deu errado ao carregar o contrato!\n${err}`)
    }});
  }

  handleServiceTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;

    if(selectElement.value.toLowerCase().includes('outros')) {
      this.SERVICES_LIST = HELP_SERVICES;

    } else if (selectElement.value.toLowerCase().includes('commerce')) {
      this.SERVICES_LIST_OPTIONS = DEV_COMMERCE_OPTIONS;
      this.SERVICES_LIST = DEV_COMMERCE_SERVICES;
    } else {
      this.SERVICES_LIST_OPTIONS = DEV_INST_OPTIONS;
      this.SERVICES_LIST = DEV_INST_SERVICES;
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
        this.isFetching = true;

        const extEmpresaGroup = this.contractForm.controls['extEmpresaGroup'];
        this.clientsService.getClientByCnpj( cnpj ).subscribe({
          next: ({ client }) => {
        
            if(client !== null && extEmpresaGroup) {
              this.clientAlreadyExist = true;
  
              extEmpresaGroup.get('extEmpresaNome').setValue(client.empresaNome);
              
              if(client.empresaIE) {
                extEmpresaGroup.get('extEmpresaIE').setValue(client.empresaIE);
              }
      
              extEmpresaGroup.get('extEmpresaCEP').setValue(client.empresaCep);
              extEmpresaGroup.get('extEmpresaEndereco').setValue(client.empresaEndereco);
              extEmpresaGroup.get('extEmpresaBairro').setValue(client.empresaBairro);
              extEmpresaGroup.get('extEmpresaCidade').setValue(client.empresaCidade);
              extEmpresaGroup.get('extEmpresaEstado').setValue(client.empresaEstado);
      
            } else {
              this.clientAlreadyExist = false;
      
              extEmpresaGroup.get('extEmpresaNome').setValue('');
              extEmpresaGroup.get('extEmpresaIE').setValue('');
              extEmpresaGroup.get('extEmpresaCEP').setValue('');
              extEmpresaGroup.get('extEmpresaEndereco').setValue('');
              extEmpresaGroup.get('extEmpresaBairro').setValue('');
              extEmpresaGroup.get('extEmpresaCidade').setValue('');
              extEmpresaGroup.get('extEmpresaEstado').setValue('');
            }
            this.isFetching = false;
          },
          error: error => {
            this.isFetching = false;
            alert(`Algo deu errado ao consultar clientes.\n${JSON.stringify(error)}`);
          }
        });
      }
    }
  }

  onCepChange(cep: string) {
    if(!this.isEditMode && cep !== null && !this.clientAlreadyExist) {
      if(cep.length === 8) {
        this.isFetching = true;

        this.viaCepService.getCepInfo(cep).subscribe({
          next: (viaCepResponse: CEP) => {
          if(viaCepResponse) {
            const extEmpresaGroup = this.contractForm.controls['extEmpresaGroup'];

            extEmpresaGroup.get('extEmpresaEndereco').setValue(viaCepResponse.logradouro);
            extEmpresaGroup.get('extEmpresaBairro').setValue(viaCepResponse.bairro);
            extEmpresaGroup.get('extEmpresaCidade').setValue(viaCepResponse.localidade);

            const estado = this.viaCepService.getStateName(viaCepResponse.uf)
            extEmpresaGroup.get('extEmpresaEstado').setValue(estado);
          }
          this.isFetching = false;
        },
        error: err => {
          this.isFetching = false;
          alert(`Algo deu errado ao consultar o CEP.\n${err}`);
        }});
      }
    }
  }

  onConfirmCreate() {
    this.contratoCriado = false;
    let generatedId = nanoid();
    generatedId = generatedId.toLowerCase();

    if(this.contractForm.value.nzGroup.nzTime === 'Marketing') {
      this.contratoEmpresa = 'Nairuz';
      this.contratoTime = 'Marketing';
    }

    const newContrato: Contract = {
      contratoId: generatedId,
      contratoAutor: this.contratoAutor,
      contratoStatus: this.contratoStatus,
      contratoEmpresa: this.contratoEmpresa,
      contratoTime: this.contratoTime,
      contratoCriadoEm: new Date(Date.now()).toISOString(),
      ...this.contractForm.value
    }

    // cria novo contrato
    this.contractsService.createContract(newContrato).subscribe({
      next: async () => {
        // cria novo cliente na base de dados para consultar posteriormente
        const client = {
          empresaCnpj: this.contractForm.value.extEmpresaGroup.extEmpresaCnpj,
          empresaNome: this.contractForm.value.extEmpresaGroup.extEmpresaNome,
          empresaIE: this.contractForm.value.extEmpresaGroup.extEmpresaIE,
          empresaCep: this.contractForm.value.extEmpresaGroup.extEmpresaCEP,
          empresaEndereco: this.contractForm.value.extEmpresaGroup.extEmpresaEndereco,
          empresaBairro: this.contractForm.value.extEmpresaGroup.extEmpresaBairro,
          empresaCidade: this.contractForm.value.extEmpresaGroup.extEmpresaCidade,
          empresaEstado: this.contractForm.value.extEmpresaGroup.extEmpresaEstado,
          criado_em: new Date(Date.now()).toISOString()
        }
        this.clientsService.getClientByCnpj( client.empresaCnpj ).subscribe(
          (getClientByCnpjResponse) => {
            if(getClientByCnpjResponse.client === null) {
              this.clientsService.createClient(client).subscribe();
              this.clientAlreadyExist = true;
            }
          }
        )

        await this.generatePdf();
        this.contratoCriado = true;
        this.contractForm.resetForm();
      },
      error: (err) => {
        alert(`Algo deu errado ao criar um novo contrato!\n${JSON.stringify(err)}`);
      }
    });
  }

  async onConfirmEdit () {
    this.contratoCriado = false;

    const editedContract: Contract = {
      contratoId: this.contractId,
      contratoAutor: this.contratoAutor,
      contratoStatus: this.contratoStatus,
      contratoEmpresa: this.contratoEmpresa,
      contratoTime: this.contratoTime,
      contratoCriadoEm: this.contratoCriadoEm,
      contratoAtualizadoEm: new Date(Date.now()).toISOString(),
      ...this.contractForm.value
    }

    this.contractsService.editContract(this.contractMongo_id, editedContract).subscribe({
      next: async () => {
        await this.generatePdf();
    
        this.contratoCriado = true
    
        this.contractForm.resetForm();
      },
      error: err => {
        this.contractForm.resetForm();
        alert(`Algo deu errado ao editar o contrato!\n${err.error}`);
      }
    });
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
      alert(`Erro ao gerar PDF: \n${error}`);
    } finally {
      this.isGeneratingPdf = false; // Desativar estado de carregamento
    }
  }
}
