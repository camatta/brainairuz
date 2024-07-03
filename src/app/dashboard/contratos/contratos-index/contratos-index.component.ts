import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { catchError, of } from "rxjs";

import { ContractsService } from "src/app/services/contracts.service";
import { SpinnerComponent } from "src/app/ui/loader/spinner.component";

type ContractInfo = {
  icon: string;
  quantity: number,
  title: string,
  percentage: number
}

@Component({
  selector: 'app-contratos-index',
  templateUrl: './contratos-index.component.html',
  styleUrls: ['./contratos-index.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    SpinnerComponent
  ]
})
export class ContratosIndexComponent {
  isFetching: boolean = true;
  contractsResume: ContractInfo[] = [];

  totalContractsYear: number = 0;
  totalTechContracts: number = 0;
  totalMketContracts: number = 0;
  totalContractsMonth: number = 0;

  constructor(private contractsService: ContractsService) {}

  ngOnInit() {
    const dateNow = new Date(Date.now());
    const currentYear = dateNow.getFullYear();
    const currentMonth = dateNow.getMonth();

    this.contractsService.getContracts().pipe(
    catchError(err => {
      alert(`Erro ao consultar dados.\n${err}`);
      this.isFetching = false;
      return of({ contracts: [] });
    })
    ).subscribe(({ contracts }) => {
      contracts.map(({ contratoCriadoEm, contratoTime }) => {
        const contractDate = new Date(contratoCriadoEm);
        const contractYear = contractDate.getFullYear();
        const contractMonth = contractDate.getMonth();

        if(contractYear === currentYear) {
          this.totalContractsYear++;

          if(contractMonth === currentMonth) {
            this.totalContractsMonth++;
          }
          if(contratoTime === 'Tecnologia') {
            this.totalTechContracts++;
          }
          if(contratoTime === 'Marketing') {
            this.totalMketContracts++;
          }
        }
      });

      this.contractsResume.push({
        icon: 'fa-solid fa-file-contract',
        quantity: this.totalContractsYear,
        title: 'Contratos criados neste ano',
        percentage: 100
      });

      this.contractsResume.push({
        icon: 'fa-solid fa-code',
        quantity: this.totalTechContracts,
        title: 'Contratos criados de Tecnologia',
        percentage: Math.floor(this.totalTechContracts / this.totalContractsYear) * 100
      });

      this.contractsResume.push({
        icon: 'fa-solid fa-arrow-pointer',
        quantity: this.totalMketContracts,
        title: 'Contratos criados de Marketing',
        percentage: Math.floor(this.totalMketContracts / this.totalContractsYear) * 100
      });

      this.contractsResume.push({
        icon: 'fa-solid fa-file-contract',
        quantity: this.totalContractsMonth,
        title: 'Contratos criados neste mês',
        percentage: Math.floor(this.totalContractsMonth / this.totalContractsYear) * 100
      });

      this.isFetching = false;
    });
  }
}