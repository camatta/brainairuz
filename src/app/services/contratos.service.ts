import { Injectable } from "@angular/core";

import { Contrato } from "../dashboard/contratos/IContrato";

@Injectable({
  providedIn: 'root'
})
export class ContratosService {
  private CONTRATOS: Contrato[] = [
    {
      contratoId: "jotdwmwbtq9kblxoth8bx",
      contratoAutor: "Dev Nairuz",
      contratoStatus: "Minuta contratual",
      contratoServico: "Tecnologia",
      criadoEm: "2024-06-21",
      atualizadoEm: "",
      nzGroup: {
        nzEmpresaResponsavel: "Nairuz",
        nzTime: "Tecnologia",
        nzTipoSite: "E-commerce",
        nzServico: "Personalizado",
        nzServicoPlataforma: "Linx"
      },
      extEmpresaGroup: {
        extEmpresaCnpj: 12345678901234,
        extEmpresaNome: "Cyclotronics",
        extEmpresaIE: "",
        extEmpresaEndereco: "Rua teste, 123",
        extEmpresaBairro: "bairro teste",
        extEmpresaCEP: 13054500,
        extEmpresaCpfRepLegal: 12346789090,
        extEmpresaNomeRepLegal: "Claudimar Bezerra"
      },
      projetoGroup: {
        projetoPrazo: 20,
        projetoValor: 120000,
        projetoParcelas: 6,
        projetoParcelasValor: 20000.00,
        projetoMulta: 60000.00,
        projetoData: "2024-06-21",
        projetoInformacoes: "<font face=\"Poppins\" size=\"2\"><b>Testando como t&#237;tulo bold e tamanho 2</b></font><p><font face=\"Poppins\" size=\"1\"><i>texto em it&#225;lico com tamanho 1</i></font></p><p><font face=\"Poppins\" size=\"1\"><u>sublinhado com tamanho 1</u></font></p><p></p><ul><li><font face=\"Poppins\" size=\"1\">lista sem ordena&#231;&#227;o item 01</font></li><li><font face=\"Poppins\" size=\"1\">lista sem ordena&#231;&#227;o item 02</font></li></ul><p></p><ol><li><font face=\"Poppins\" size=\"1\">lista ordenada tamanho 01</font></li><li><font face=\"Poppins\" size=\"1\">item 02 lista ordenada</font></li></ol><p><font face=\"Poppins\" size=\"1\"><b>bold e alinhamento ao centro</b></font></p><p><font face=\"Poppins\" size=\"1\"><b>texto em destaque</b></font></p><p><font face=\"Poppins\" size=\"1\">texto corrido</font></p><p><font face=\"Poppins\" size=\"1\">quebra de linha</font></p><p></p><p></p>"
      }
    },
    {
      contratoId: "0at4cfc3ep0p6",
      contratoAutor: "Dev Nairuz",
      contratoStatus: "Minuta contratual",
      contratoServico: "Tecnologia",
      criadoEm: "2024-06-21",
      atualizadoEm: "",
      nzGroup: {
        nzEmpresaResponsavel: "Nairuz",
        nzTime: "Tecnologia",
        nzTipoSite: "E-commerce",
        nzServico: "Personalizado",
        nzServicoPlataforma: "Linx"
      },
      extEmpresaGroup: {
        extEmpresaCnpj: 45451430000168,
        extEmpresaNome: "FP Concept",
        extEmpresaIE: "",
        extEmpresaEndereco: "R. JACOB SCHMIDT, 75 - SALA 01",
        extEmpresaBairro: "PIONEIROS",
        extEmpresaCEP: 88331015,
        extEmpresaCpfRepLegal: 12346789090,
        extEmpresaNomeRepLegal: "Nairuz"
      },
      projetoGroup: {
        projetoPrazo: 20,
        projetoValor: 15000,
        projetoParcelas: 5,
        projetoParcelasValor: 3000.00,
        projetoMulta: 7500.00,
        projetoData: "2024-06-21",
        projetoInformacoes: "<h1><font face=\"Poppins\" size=\"1\"><span>Teste de h1</span></font></h1><p><font face=\"Poppins\" size=\"1\"><span>conte&#250;do abaixo do h1</span></font></p><h2><font face=\"Poppins\" size=\"1\"><span>teste de h2</span></font></h2><p><font face=\"Poppins\" size=\"1\"><span>conte&#250;do abaixo do h2 com negrito</span></font></p><p></p><ul><li><font face=\"Poppins\" size=\"1\"><span>lista ul item 01</span></font></li><li><font face=\"Poppins\" size=\"1\"><span>lista ul item 02</span></font></li></ul><p></p><ol><li><font face=\"Poppins\" size=\"1\"><b>llista ol 01</b></font></li><li><font face=\"Poppins\" size=\"1\"><b>lista ol 02</b></font></li></ol><p><font face=\"Poppins\" size=\"1\"><b>demais infos</b></font></p><p><font face=\"Poppins\" size=\"1\"><i>it&#225;lico</i></font></p><p><font face=\"Poppins\" size=\"1\"><b>negrito</b></font></p><p><font face=\"Poppins\" size=\"1\"><b><i>negrito e it&#225;lico</i></b></font></p><h2><font face=\"Poppins\" size=\"1\">heading h2 centralizado</font></h2><p></p><p></p>"
      }
    },
    {
      contratoId: "45233oacn3ioc",
      contratoAutor: "César Achiles",
      contratoStatus: "Minuta contratual",
      contratoServico: "Tecnologia",
      criadoEm: "2024-06-21",
      atualizadoEm: "",
      nzGroup: {
        nzEmpresaResponsavel: "Nairuz",
        nzTime: "Tecnologia",
        nzTipoSite: "E-commerce",
        nzServico: "Tema",
        nzServicoPlataforma: "MageShop"
      },
      extEmpresaGroup: {
        extEmpresaCnpj: 12345678901234,
        extEmpresaNome: "GPTW",
        extEmpresaIE: 123456789,
        extEmpresaEndereco: "Rua teste, 123",
        extEmpresaBairro: "bairro teste",
        extEmpresaCEP: 13054500,
        extEmpresaCpfRepLegal: 12345678909,
        extEmpresaNomeRepLegal: "Representante Teste"
      },
      projetoGroup: {
        projetoPrazo: 20,
        projetoValor: 1200,
        projetoParcelas: 2,
        projetoParcelasValor: 600.00,
        projetoMulta: 600.00,
        projetoData: "2024-06-18",
        projetoInformacoes: "<font face=\"arial\" size=\"3\">rsdasd</font>"
      }
    },
    {
      contratoId: "45233o7cn3ioc",
      contratoAutor: "César Achiles",
      contratoStatus: "Aguardando assinatura",
      contratoServico: "Tecnologia",
      criadoEm: "2024-06-21",
      atualizadoEm: "",
      nzGroup: {
        nzEmpresaResponsavel: "Nairuz",
        nzTime: "Tecnologia",
        nzTipoSite: "E-commerce",
        nzServico: "Tema",
        nzServicoPlataforma: "MageShop"
      },
      extEmpresaGroup: {
        extEmpresaCnpj: 12345678901234,
        extEmpresaNome: "Cyclotronics",
        extEmpresaIE: 123456789,
        extEmpresaEndereco: "Rua teste, 123",
        extEmpresaBairro: "bairro teste",
        extEmpresaCEP: 13054500,
        extEmpresaCpfRepLegal: 12345678909,
        extEmpresaNomeRepLegal: "Representante Teste"
      },
      projetoGroup: {
        projetoPrazo: 20,
        projetoValor: 1200,
        projetoParcelas: 2,
        projetoParcelasValor: 600.00,
        projetoMulta: 600.00,
        projetoData: "2024-06-18",
        projetoInformacoes: "<font face=\"arial\" size=\"3\">rsdasd</font>"
      }
    },
    {
      contratoId: "45233o7cn3i1a",
      contratoAutor: "Camila Silva",
      contratoStatus: "Concluído",
      contratoServico: "Tecnologia",
      criadoEm: "2024-06-21",
      atualizadoEm: "",
      nzGroup: {
        nzEmpresaResponsavel: "Nairuz",
        nzTime: "Tecnologia",
        nzTipoSite: "E-commerce",
        nzServico: "Tema",
        nzServicoPlataforma: "MageShop"
      },
      extEmpresaGroup: {
        extEmpresaCnpj: 12345678901234,
        extEmpresaNome: "Nairuz",
        extEmpresaIE: 123456789,
        extEmpresaEndereco: "Rua teste, 123",
        extEmpresaBairro: "bairro teste",
        extEmpresaCEP: 13054500,
        extEmpresaCpfRepLegal: 12345678909,
        extEmpresaNomeRepLegal: "Representante Teste"
      },
      projetoGroup: {
        projetoPrazo: 20,
        projetoValor: 1200,
        projetoParcelas: 2,
        projetoParcelasValor: 600.00,
        projetoMulta: 600.00,
        projetoData: "2024-06-18",
        projetoInformacoes: "<font face=\"arial\" size=\"3\">rsdasd</font>"
      }
    },
    {
      contratoId: "45233o7cn3ioa",
      contratoAutor: "Valéria Queiroz",
      contratoStatus: "Cancelado",
      contratoServico: "Tecnologia",
      criadoEm: "2024-06-21",
      atualizadoEm: "",
      nzGroup: {
        nzEmpresaResponsavel: "Nairuz",
        nzTime: "Tecnologia",
        nzTipoSite: "E-commerce",
        nzServico: "Tema",
        nzServicoPlataforma: "MageShop"
      },
      extEmpresaGroup: {
        extEmpresaCnpj: 12345678901234,
        extEmpresaNome: "Nairuz",
        extEmpresaIE: 123456789,
        extEmpresaEndereco: "Rua teste, 123",
        extEmpresaBairro: "bairro teste",
        extEmpresaCEP: 13054500,
        extEmpresaCpfRepLegal: 12345678909,
        extEmpresaNomeRepLegal: "Representante Teste"
      },
      projetoGroup: {
        projetoPrazo: 20,
        projetoValor: 1200,
        projetoParcelas: 2,
        projetoParcelasValor: 600.00,
        projetoMulta: 600.00,
        projetoData: "2024-06-18",
        projetoInformacoes: "<font face=\"arial\" size=\"3\">rsdasd</font>"
      }
    }
  ];

  constructor() {}

  getContratos() {
    const allContracts = this.CONTRATOS;
    return allContracts;
  }

  async getContratoById(id: string) {
    const contract = await this.CONTRATOS.find(({ contratoId }) => contratoId === id)

    return contract;
  }

  async createContrato( contrato: Contrato ) {
    await this.CONTRATOS.unshift(contrato);
  }

  deleteContrato(contratoId: string) {
    const allContracts = this.CONTRATOS;
    const newContracts = allContracts.filter((contract) => contract.contratoId !== contratoId )
    
    this.CONTRATOS = newContracts;
  }

  editContrato(contrato: Contrato) {
    const allContracts = this.CONTRATOS;
    const newContracts = allContracts.map(existingContract => {
      if(existingContract.contratoId === contrato.contratoId) {
        return {
          ...existingContract, // Retém todas as propriedades do contrato original
          ...contrato // Substitui as propriedades com os valores do contrato atualizado
        };
      } else {
        return existingContract; // Retorna o contrato original se não for para ser atualizado
      }
    });

    this.CONTRATOS = newContracts;
  }

  editContratoStatus(id: string, status: string) {
    const allContracts = this.CONTRATOS;
    const contractToEdit = allContracts.findIndex(({ contratoId }) => contratoId === id)

    if(contractToEdit !== -1) {
      allContracts[contractToEdit].contratoStatus = status;

      this.CONTRATOS = allContracts;
    }

    this.CONTRATOS = allContracts;
  }

  /* countContratosByYear() {
    let quantity
  } */
}