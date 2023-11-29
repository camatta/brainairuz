import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercialComponent } from './comercial.component';

describe('ComercialComponent', () => {
  let component: ComercialComponent;
  let fixture: ComponentFixture<ComercialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComercialComponent]
    });
    fixture = TestBed.createComponent(ComercialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
