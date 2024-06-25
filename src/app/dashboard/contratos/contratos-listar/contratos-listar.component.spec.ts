import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratosListarComponent } from './contratos-listar.component';

describe('ContratosListarComponent', () => {
  let component: ContratosListarComponent;
  let fixture: ComponentFixture<ContratosListarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContratosListarComponent]
    });
    fixture = TestBed.createComponent(ContratosListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
