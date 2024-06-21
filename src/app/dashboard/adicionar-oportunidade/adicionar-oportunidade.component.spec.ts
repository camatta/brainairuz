import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarOportunidadeComponent } from './adicionar-oportunidade.component';

describe('AdicionarOportunidadeComponent', () => {
  let component: AdicionarOportunidadeComponent;
  let fixture: ComponentFixture<AdicionarOportunidadeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdicionarOportunidadeComponent]
    });
    fixture = TestBed.createComponent(AdicionarOportunidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
