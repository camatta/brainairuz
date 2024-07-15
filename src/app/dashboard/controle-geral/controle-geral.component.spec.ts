import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControleGeralComponent } from './controle-geral.component';

describe('ControleGeralComponent', () => {
  let component: ControleGeralComponent;
  let fixture: ComponentFixture<ControleGeralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ControleGeralComponent]
    });
    fixture = TestBed.createComponent(ControleGeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
