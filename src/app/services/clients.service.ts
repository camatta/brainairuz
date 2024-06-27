import { Injectable } from "@angular/core";

type Client = {
  _id?: string;
  empresaCnpj: string;
  empresaNome: string;
  empresaIE?: number | "";
  empresaCep: number;
  empresaEndereco: string;
  empresaBairro: string;
  empresaCidade: string;
  empresaEstado: string;
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
    const client = await this.CLIENTS.find(({ empresaCnpj }) => empresaCnpj === id)

    if(client) {
      return client
    }
    return null
  }

  async createClient(client: Client) {
    const clientAlreadyExists = await this.CLIENTS.findIndex(({ empresaCnpj }) => empresaCnpj === client.empresaCnpj );

    if(clientAlreadyExists === -1) {
      await this.CLIENTS.push(client);
    }
  }
}