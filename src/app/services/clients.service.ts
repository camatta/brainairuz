import { Injectable } from "@angular/core";

type Client = {
  empresa_cnpj: string;
  nome_empresa: string;
  inscricao_estadual?: string;
  empresa_endereco: string;
  empresa_bairro: string;
  empresa_cep: string;
  criado_em: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private CLIENTS: Client[] = [];

  constructor() {}

  async getClients(): Promise<Client[]> {
    const allClients = await this.CLIENTS;
    return allClients;
  }

  async getClientById(id: string): Promise<Client | null> {
    const client = await this.CLIENTS.find(({ empresa_cnpj }) => empresa_cnpj === id)

    if(client) {
      return client
    }
    return null
  }

  async createClient(client: Client) {
    const clientAlreadyExists = await this.CLIENTS.findIndex(({ empresa_cnpj }) => empresa_cnpj === client.empresa_cnpj);
    console.log(clientAlreadyExists)

    if(clientAlreadyExists === -1) {
      await this.CLIENTS.push(client);
    }
  }
}