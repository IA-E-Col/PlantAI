import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterCollabComponent } from './ajouter-collab.component';

describe('AjouterCollabComponent', () => {
  let component: AjouterCollabComponent;
  let fixture: ComponentFixture<AjouterCollabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterCollabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouterCollabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
