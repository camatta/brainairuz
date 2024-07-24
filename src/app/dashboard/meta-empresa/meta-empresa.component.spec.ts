import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaEmpresaComponent } from './meta-empresa.component';

describe('MetaEmpresaComponent', () => {
  let component: MetaEmpresaComponent;
  let fixture: ComponentFixture<MetaEmpresaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MetaEmpresaComponent]
    });
    fixture = TestBed.createComponent(MetaEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
