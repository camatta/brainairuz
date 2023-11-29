import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiramideComponent } from './piramide.component';

describe('PiramideComponent', () => {
  let component: PiramideComponent;
  let fixture: ComponentFixture<PiramideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PiramideComponent]
    });
    fixture = TestBed.createComponent(PiramideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
