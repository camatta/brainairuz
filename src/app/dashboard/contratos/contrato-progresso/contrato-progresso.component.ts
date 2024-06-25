import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-contrato-progresso',
  templateUrl: './contrato-progresso.component.html',
  styleUrls: ['./contrato-progresso.component.css'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class ContratoProgressoComponent {
  @Input() percentage: number;
  @Input() contractUpdated: boolean;
  @Input() isLoadingContract: boolean;

  constructor() {}
}