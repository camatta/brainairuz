import { Injectable } from "@angular/core";

import { Contract } from "../dashboard/contratos/contract.model";

@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  private CONTRACTS: Contract[] = [];

  constructor() {}

  getContracts() {
    const allContracts = this.CONTRACTS;
    return allContracts;
  }

  async getContractById(id: string) {
    const contract = await this.CONTRACTS.find(({ contratoId }) => contratoId === id)

    return contract;
  }

  async createContract( contract: Contract ) {
    await this.CONTRACTS.unshift(contract);
  }

  deleteContract(contractId: string) {
    const allContracts = this.CONTRACTS;
    const newContracts = allContracts.filter((contract) => contract.contratoId !== contractId )
    
    this.CONTRACTS = newContracts;
  }

  editContract(contract: Contract) {
    const allContracts = this.CONTRACTS;
    const newContracts = allContracts.map(existingContract => {
      if(existingContract.contratoId === contract.contratoId) {
        return {
          ...existingContract, // Retém todas as propriedades do contrato original
          ...contract // Substitui as propriedades com os valores do contrato atualizado
        };
      } else {
        return existingContract; // Retorna o contrato original se não for para ser atualizado
      }
    });

    this.CONTRACTS = newContracts;
  }

  editContractStatus(id: string, status: string) {
    const allContracts = this.CONTRACTS;
    const contractToEdit = allContracts.findIndex(({ contratoId }) => contratoId === id)

    if(contractToEdit !== -1) {
      allContracts[contractToEdit].contratoStatus = status;

      this.CONTRACTS = allContracts;
    }

    this.CONTRACTS = allContracts;
  }

  /* countContratosByYear() {
    let quantity
  } */
}