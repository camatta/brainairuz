import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixProdutosComponent } from './mix-produtos.component';

describe('MixProdutosComponent', () => {
  let component: MixProdutosComponent;
  let fixture: ComponentFixture<MixProdutosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MixProdutosComponent]
    });
    fixture = TestBed.createComponent(MixProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
