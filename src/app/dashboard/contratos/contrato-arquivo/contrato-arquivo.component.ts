import { Component, Input } from "@angular/core";

import { Contract } from "../contract.model";
import { SharedModule } from "src/app/modules/shared-module/shared-module.module";
import { DateMaskPipe } from "../../../pipes/date-mask.pipe";
import { ContratoFooterAzulComponent } from "./contrato-footer-azul/contrato-footer-azul.component";
import { ContratoFooterBrancoComponent } from "./contrato-footer-branco/contrato-footer-branco.component";
import { CurrencyToTextPipe } from "src/app/pipes/currency-to-text.pipe";
import { NumberToTextPipe } from "src/app/pipes/number-to-text.pipe";

@Component({
  selector: 'app-contrato-arquivo',
  templateUrl: './contrato-arquivo.component.html',
  styleUrls: ['./contrato-arquivo.component.css'],
  standalone: true,
  imports: [
    SharedModule,
    DateMaskPipe,
    CurrencyToTextPipe,
    NumberToTextPipe,
    ContratoFooterAzulComponent,
    ContratoFooterBrancoComponent
  ]
})
export class ContratoArquivoComponent {
  @Input() contract: Contract | null = null;

  constructor() {}
}