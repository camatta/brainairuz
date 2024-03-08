import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaDeValoresComponent } from './tabela-valores.component';

describe('TabelaDeValoresComponent', () => {
  let component: TabelaDeValoresComponent;
  let fixture: ComponentFixture<TabelaDeValoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabelaDeValoresComponent]
    });
    fixture = TestBed.createComponent(TabelaDeValoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
