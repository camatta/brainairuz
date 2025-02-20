import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaMetasComponent } from './tabela-metas.component';

describe('TabelaMetasComponent', () => {
  let component: TabelaMetasComponent;
  let fixture: ComponentFixture<TabelaMetasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabelaMetasComponent]
    });
    fixture = TestBed.createComponent(TabelaMetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
