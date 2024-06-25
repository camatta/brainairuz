import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector } from '@angular/core';
import { ComponentRef, Type } from '@angular/core';
import { ConfirmModalComponent } from '../dashboard/confirm-modal/confirm-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalService {
  private componentRef: ComponentRef<ConfirmModalComponent>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  open(
    message: string,
    successMessage: string,
    confirmCallback: () => void,
    declinedCallback?: () => void,
    modalTextConfirm?: string,
    modalTextCancel?: string
  ) {
    // Criar uma instância do componente de modal
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ConfirmModalComponent);
    this.componentRef = componentFactory.create(this.injector);
    
    // Adicionar o componente ao DOM
    this.appRef.attachView(this.componentRef.hostView);
    const domElem = (this.componentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    // Configurar a mensagem e os callbacks
    this.componentRef.instance.modalActive = true;
    this.componentRef.instance.message = message;
    this.componentRef.instance.successMessage = successMessage;
    this.componentRef.instance.modalTextConfirm = modalTextConfirm || 'Sim';
    this.componentRef.instance.modalTextCancel = modalTextCancel || 'Não';
    this.componentRef.instance.confirmed.subscribe(() => {
      confirmCallback();
      //this.close();
    });
    this.componentRef.instance.declined.subscribe(() => {
      this.close();
      if(declinedCallback) {
        declinedCallback()
      }
    });
    this.componentRef.instance.finalConfirmed.subscribe(() => {
      this.close();
    });
  }

  close() {
    // Remover o componente do DOM
    this.appRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();
  }
}
