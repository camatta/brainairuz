import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class ConfirmModalComponent {
  confirmedResponse: boolean = false;

  @Input() message: string;
  @Input() successMessage: string;
  @Input() modalTextConfirm?: string;
  @Input() modalTextCancel?: string;
  @Input() modalActive: boolean | null = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() declined = new EventEmitter<void>();
  @Output() finalConfirmed = new EventEmitter<void>();

  constructor() {}

  confirm() {
    this.confirmed.emit();
    if(this.successMessage === '') {
      this.finalConfirm();
    }
    this.message = this.successMessage
    this.confirmedResponse = true
  }

  decline() {
    this.declined.emit();
    this.modalActive = false;
  }

  finalConfirm() {
    this.finalConfirmed.emit()
    this.modalActive = false;
  }
}