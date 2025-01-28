import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetInfComponent } from './projet-inf.component';

describe('ProjetInfComponent', () => {
  let component: ProjetInfComponent;
  let fixture: ComponentFixture<ProjetInfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetInfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjetInfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
