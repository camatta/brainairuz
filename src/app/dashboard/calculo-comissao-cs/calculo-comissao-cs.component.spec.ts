import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculoComissaoComponent } from './calculo-comissao.component';

describe('CalculoComissaoComponent', () => {
  let component: CalculoComissaoComponent;
  let fixture: ComponentFixture<CalculoComissaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalculoComissaoComponent]
    });
    fixture = TestBed.createComponent(CalculoComissaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
