import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  AngularEditorModule,
  AngularEditorConfig,
} from '@kolkov/angular-editor';
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

import {
  DEV_SERVICES_LIST,
  DEV_COMMERCE_OPTIONS,
  HELP_SERVICES,
  PROJECT_TYPES,
  TEAMS,
} from '../servicos-data-in-memory';
import type { SERVICE, PROJECT, TEAM } from '../types';
import { Contract } from '../contract.model';
import { nanoid } from 'nanoid';
import { type CEP, ViaCepService } from 'src/app/services/via.cep.service';
import { ProductsService } from 'src/app/services/products.service';
import { editorConfig } from './editorConfig';

@Component({
  selector: 'app-contrato-form',
  templateUrl: './contrato-form.component.html',
  styleUrls: ['./contrato-form.component.css'],
  standalone: true,
  imports: [
    HttpClientModule,
    AngularEditorModule,
    SharedModule,
    ContratoArquivoComponent,
    ContratoProgressoComponent,
    ContratoModalpdfComponent,
  ],
})
export class ContratoFormComponent {
  @ViewChild('contractFormRef') contractForm: NgForm;
  contractToView: Contract;
  ALLPRODUCTS: any[] = [];
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
  markup = {
    min: null,
    max: null,
    value: null,
    group: null,
  };

  contratoCriado: boolean = false;
  isGeneratingPdf: boolean = false;
  clientAlreadyExist: boolean = true;

  progress: number = 0;
  private progressSubscription: Subscription | undefined;
  pdfUrl: string | null = null;

  TEAMS_LIST: TEAM = TEAMS;
  PROJECT_LIST: PROJECT = PROJECT_TYPES;

  SERVICES_LIST: SERVICE = DEV_SERVICES_LIST;
  SERVICES_LIST_OPTIONS: SERVICE = DEV_COMMERCE_OPTIONS;

  HELP_SERVICES_LIST: SERVICE = HELP_SERVICES;
  DEV_PLATFORMS_LIST: SERVICE = DEV_COMMERCE_OPTIONS;
  DEV_SERVICES: SERVICE = DEV_SERVICES_LIST;

  editorConfig: AngularEditorConfig = editorConfig;

  constructor(
    private authService: AuthService,
    private contractsService: ContractsService,
    private productsService: ProductsService,
    private pdfGeneratorService: PdfGeneratorService,
    private clientsService: ClientsService,
    private confirmModalService: ConfirmModalService,
    private viaCepService: ViaCepService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.contratoAutor = this.authService.getUserName();

    this.progressSubscription = this.pdfGeneratorService.progress$.subscribe(
      (progress) => {
        this.progress = progress;
      }
    );

    this.loadProducts();

    this.route.paramMap.subscribe(async (params) => {
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

  async loadProducts() {
    if (!this.ALLPRODUCTS.length) {
      this.productsService.getProducts().subscribe((data) => {
        const allProducts = data;
        this.ALLPRODUCTS = allProducts;

        const projectsTypes = new Set<string>();
        const devProjectsPlatforms = new Set<string>();
        const devProjectsOptions = new Set<string>();
        const recurringOptions = new Set<string>();

        allProducts.forEach((product) => {
          projectsTypes.add(product.tipoProduto);

          if (product.tipoProduto === 'Projeto') {
            devProjectsPlatforms.add(product.tecnologia_servico);
            devProjectsOptions.add(product.produto);
          }
          if (product.tipoProduto === 'Recorrência') {
            recurringOptions.add(product.tecnologia_servico);
          }
        });

        if (this.PROJECT_LIST.list.length == 1) {
          projectsTypes.forEach((type) => {
            this.PROJECT_LIST.list.push({
              id: type,
              name: type,
            });
          });

          devProjectsPlatforms.forEach((platform) => {
            this.DEV_PLATFORMS_LIST.list.push({
              id: platform,
              name: platform,
            });
          });

          recurringOptions.forEach((option) => {
            this.HELP_SERVICES_LIST.list.push({
              id: option,
              name: option,
            });
          });
        }
      });
    }
  }

  async loadContract() {
    this.isFetching = true;
    this.contractsService.getContractById(this.contractMongo_id).subscribe({
      next: ({ contract }) => {
        this.contractId = contract.contratoId;
        this.contratoAutor = contract.contratoAutor;
        this.contratoStatus = contract.contratoStatus;
        this.contratoEmpresa = contract.contratoEmpresa;
        this.contratoTime = contract.contratoTime;
        this.contratoCriadoEm = contract.contratoCriadoEm;
        this.contratoAtualizadoEm = contract.contratoAtualizadoEm;
        this.markup.group = contract.projetoGroup.projetoMarkupGrupo;
        this.markup.value = contract.projetoGroup.projetoMarkupValor;
        const { minMarkup, maxMarkup } = this.productsService.getMarkup(
          Number(this.markup.group)
        );
        this.markup.min = minMarkup;
        this.markup.max = maxMarkup;

        const nzGroup = this.contractForm.controls['nzGroup'];
        nzGroup.get('nzTime').setValue(contract.nzGroup.nzTime);
        nzGroup.get('nzTipoProjeto').setValue(contract.nzGroup.nzTipoProjeto);

        if (contract.contratoTime === 'Tecnologia') {
          this.setDevServices(contract.nzGroup.nzProjetoPlataforma);
          nzGroup
            .get('nzProjetoPlataforma')
            .setValue(contract.nzGroup.nzProjetoPlataforma);
        }

        if (contract.contratoTime === 'Marketing') {
          this.SERVICES_LIST = this.HELP_SERVICES_LIST;
          nzGroup
            .get('nzProjetoHoras')
            .setValue(contract.nzGroup.nzProjetoHoras);
        }

        nzGroup.get('nzServico').setValue(contract.nzGroup.nzServico);

        this.contractForm.controls['extEmpresaGroup'].setValue({
          ...contract.extEmpresaGroup,
        });
        this.contractForm.controls['projetoGroup'].setValue({
          ...contract.projetoGroup,
        });

        this.isFetching = false;
      },
      error: (err) => {
        this.isFetching = false;
        alert(`Algo deu errado ao carregar o contrato!\n${err}`);
      },
    });
  }

  handlePlatformChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const platform = selectElement.value;

    this.setDevServices(platform);
  }

  setDevServices(platform: string) {
    // timer para aguardar que ALLPRODUCTS seja populado com dados quando está no modo edição, pois há um delay para carregar os dados
    let interval = 0;
    if (this.isEditMode) {
      interval = 100;
    }
    const timer = setInterval(() => {
      this.DEV_SERVICES.list = [
        {
          id: '',
          name: 'Selecione',
        },
      ];

      this.ALLPRODUCTS.forEach((product) => {
        if (product.tecnologia_servico === platform) {
          this.DEV_SERVICES.list.push({
            id: product.produto,
            name: product.produto,
          });
        }
      });

      if (this.ALLPRODUCTS.length) {
        clearInterval(timer);
      }
    }, interval);
  }

  handleServiceTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const serviceType = selectElement.value.toLowerCase();

    if (serviceType.includes('recorrência')) {
      this.SERVICES_LIST = this.HELP_SERVICES_LIST;
    } else {
      this.SERVICES_LIST_OPTIONS = this.DEV_PLATFORMS_LIST;
      this.SERVICES_LIST = this.DEV_SERVICES;
    }
  }

  handleServiceChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const serviceName = selectElement.value;

    const nzGroup = this.contractForm.controls['nzGroup'];
    const serviceType = nzGroup.get('nzProjetoPlataforma')?.value;

    if (!serviceName) return;

    let product;

    if (serviceType) {
      product = this.ALLPRODUCTS.find(
        (product) =>
          product.produto === serviceName &&
          product.tecnologia_servico === serviceType
      );
    } else {
      product = this.ALLPRODUCTS.find(
        (product) => product.tecnologia_servico === serviceName
      );
    }

    this.markup.group = product.grupo_markup;
    const { maxMarkup, minMarkup } = this.productsService.getMarkup(
      this.markup.group
    );
    this.markup.max = maxMarkup;
    this.markup.min = minMarkup;
    this.markup.value = maxMarkup;

    const projectGroup = this.contractForm.controls['projetoGroup'];
    const productPrice = product.valor_venda.toFixed(2);
    projectGroup.get('projetoValor').setValue(productPrice);
  }

  onInputProjectValue(value: string): void {
    if (value !== null) {
      const projectGroup = this.contractForm.controls['projetoGroup'];

      const valorMulta = Number(value) / 2;
      const multa = valorMulta.toFixed(2);

      projectGroup.get('projetoMulta').setValue(multa);

      if (
        this.isEditMode ||
        this.contractForm.value.projetoGroup.projetoParcelas
      ) {
        this.onInputInstallmentsChange(
          this.contractForm.value.projetoGroup.projetoParcelas
        );
      }
    }
  }

  onInputInstallmentsChange(installments: string): void {
    if (installments !== null) {
      const projectGroup = this.contractForm.controls['projetoGroup'];
      const projectValue = projectGroup.value.projetoValor;

      if (projectValue) {
        const installmentValue = Number(projectValue) / Number(installments);
        const installment = installmentValue.toFixed(2);

        projectGroup.get('projetoParcelasValor').setValue(installment);
      }
    }
  }

  onInputMarkupValueChange(newMarkupValue: number): void {
    if (
      newMarkupValue !== null &&
      newMarkupValue >= this.markup.min &&
      newMarkupValue <= this.markup.max
    ) {
      const stringValue = newMarkupValue.toString();

      if (stringValue.includes(',')) {
        stringValue.replace(',', '.');
      }

      const oldMarkupValue = this.markup.value;
      this.markup.value = Number(stringValue);

      const projectGroup = this.contractForm.controls['projetoGroup'];
      const oldProjectValue = Number(projectGroup.value.projetoValor);
      let newProjectValue =
        (Number(oldProjectValue) / Number(oldMarkupValue)) *
        Number(stringValue);

      projectGroup.get('projetoValor').setValue(newProjectValue.toFixed(2));
    }
  }

  async onChangeCnpj(cnpj: string) {
    if (cnpj !== null) {
      if (cnpj.length === 14) {
        this.isFetching = true;

        const extEmpresaGroup = this.contractForm.controls['extEmpresaGroup'];
        this.clientsService.getClientByCnpj(cnpj).subscribe({
          next: ({ client }) => {
            if (client !== null && extEmpresaGroup) {
              this.clientAlreadyExist = true;

              extEmpresaGroup
                .get('extEmpresaNome')
                .setValue(client.empresaNome);

              if (client.empresaIE) {
                extEmpresaGroup.get('extEmpresaIE').setValue(client.empresaIE);
              }

              extEmpresaGroup.get('extEmpresaCEP').setValue(client.empresaCep);
              extEmpresaGroup
                .get('extEmpresaEndereco')
                .setValue(client.empresaEndereco);
              extEmpresaGroup
                .get('extEmpresaBairro')
                .setValue(client.empresaBairro);
              extEmpresaGroup
                .get('extEmpresaCidade')
                .setValue(client.empresaCidade);
              extEmpresaGroup
                .get('extEmpresaEstado')
                .setValue(client.empresaEstado);
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
          error: (error) => {
            this.isFetching = false;
            alert(
              `Algo deu errado ao consultar clientes.\n${JSON.stringify(error)}`
            );
          },
        });
      }
    }
  }

  onCepChange(cep: string) {
    if (!this.isEditMode && cep !== null && !this.clientAlreadyExist) {
      if (cep.length === 8) {
        this.isFetching = true;

        this.viaCepService.getCepInfo(cep).subscribe({
          next: (viaCepResponse: CEP) => {
            if (viaCepResponse) {
              const extEmpresaGroup =
                this.contractForm.controls['extEmpresaGroup'];

              extEmpresaGroup
                .get('extEmpresaEndereco')
                .setValue(viaCepResponse.logradouro);
              extEmpresaGroup
                .get('extEmpresaBairro')
                .setValue(viaCepResponse.bairro);
              extEmpresaGroup
                .get('extEmpresaCidade')
                .setValue(viaCepResponse.localidade);

              const estado = this.viaCepService.getStateName(viaCepResponse.uf);
              extEmpresaGroup.get('extEmpresaEstado').setValue(estado);
            }
            this.isFetching = false;
          },
          error: (err) => {
            this.isFetching = false;
            alert(`Algo deu errado ao consultar o CEP.\n${err}`);
          },
        });
      }
    }
  }

  onConfirmCreate() {
    this.isGeneratingPdf = true; // Ativar estado de carregamento,

    this.contratoCriado = false;
    let generatedId = nanoid();
    generatedId = generatedId.toLowerCase();

    if (this.contractForm.value.nzGroup.nzTime === 'Marketing') {
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
      ...this.contractForm.value,
    };

    // cria novo contrato
    this.contractsService.createContract(newContrato).subscribe({
      next: async () => {
        // cria novo cliente na base de dados para consultar posteriormente
        const client = {
          empresaCnpj: this.contractForm.value.extEmpresaGroup.extEmpresaCnpj,
          empresaNome: this.contractForm.value.extEmpresaGroup.extEmpresaNome,
          empresaIE: this.contractForm.value.extEmpresaGroup.extEmpresaIE,
          empresaCep: this.contractForm.value.extEmpresaGroup.extEmpresaCEP,
          empresaEndereco:
            this.contractForm.value.extEmpresaGroup.extEmpresaEndereco,
          empresaBairro:
            this.contractForm.value.extEmpresaGroup.extEmpresaBairro,
          empresaCidade:
            this.contractForm.value.extEmpresaGroup.extEmpresaCidade,
          empresaEstado:
            this.contractForm.value.extEmpresaGroup.extEmpresaEstado,
          criado_em: new Date(Date.now()).toISOString(),
        };
        this.clientsService
          .getClientByCnpj(client.empresaCnpj)
          .subscribe((getClientByCnpjResponse) => {
            if (getClientByCnpjResponse.client === null) {
              this.clientsService.createClient(client).subscribe();
              this.clientAlreadyExist = true;
            }
          });

        const authorEmail = JSON.parse(localStorage.getItem('user')).email;
        this.contractsService
          .getAuthorByEmail(authorEmail)
          .subscribe((authorResponse) => {
            const newAuthor = {
              name: newContrato.contratoAutor,
              email: authorEmail,
            };
            if (authorResponse.author === null) {
              this.contractsService.createAuthor(newAuthor).subscribe();
            }
          });

        await this.generatePdf();
        this.contratoCriado = true;
        this.contractForm.resetForm();
      },
      error: (err) => {
        this.isGeneratingPdf = false;
        alert(
          `Algo deu errado ao criar um novo contrato!\n${JSON.stringify(err)}`
        );
      },
    });
  }

  async onConfirmEdit() {
    this.isGeneratingPdf = true; // Ativar estado de carregamento,
    this.contratoCriado = false;

    const editedContract: Contract = {
      contratoId: this.contractId,
      contratoAutor: this.contratoAutor,
      contratoStatus: this.contratoStatus,
      contratoEmpresa: this.contratoEmpresa,
      contratoTime: this.contratoTime,
      contratoCriadoEm: this.contratoCriadoEm,
      contratoAtualizadoEm: new Date(Date.now()).toISOString(),
      ...this.contractForm.value,
    };

    this.contractsService
      .editContract(this.contractMongo_id, editedContract)
      .subscribe({
        next: async () => {
          await this.generatePdf();

          this.contratoCriado = true;

          this.contractForm.resetForm();
        },
        error: (err) => {
          this.isGeneratingPdf = false;
          this.contractForm.resetForm();
          alert(`Algo deu errado ao editar o contrato!\n${err.error}`);
        },
      });
  }

  async onContractFormSubmit() {
    if (!this.contractForm.valid) {
      return;
    }

    this.contractToView = this.contractForm.value;

    if (this.contractForm.valid) {
      if (this.isEditMode) {
        this.confirmModalService.open(
          'Deseja confirmar a edição dos campos alterados?',
          '',
          () => this.onConfirmEdit()
        );
      } else {
        this.confirmModalService.open(
          'Prosseguir para a criação do contrato?',
          '',
          () => this.onConfirmCreate()
        );
      }
    }
  }

  async generatePdf(): Promise<void> {
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

    const nzGroup = this.contractForm.controls['nzGroup'];
    const nzTipoProjeto = nzGroup.get('nzTipoProjeto')?.value;
    const nzServico = nzGroup.get('nzServico')?.value;

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
      contractAddPagesIds = ['page38', 'page40', 'page41', 'page42', 'page43'];
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
      contractAddPagesIds = ['page57', 'page58', 'page59', 'page60', 'page61'];
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

    try {
      const pdfBlob = await this.pdfGeneratorService.generatePdf(
        contractPagesIds
      );
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
