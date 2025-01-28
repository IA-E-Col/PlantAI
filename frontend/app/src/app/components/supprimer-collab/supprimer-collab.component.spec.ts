import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupprimerCollabComponent } from './supprimer-collab.component';

describe('SupprimerCollabComponent', () => {
  let component: SupprimerCollabComponent;
  let fixture: ComponentFixture<SupprimerCollabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupprimerCollabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupprimerCollabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
