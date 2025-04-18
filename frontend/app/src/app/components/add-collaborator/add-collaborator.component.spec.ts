import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCollaboratorComponent } from './add-collaborator.component';

describe('AddCollaboratorComponent', () => {
  let component: AddCollaboratorComponent;
  let fixture: ComponentFixture<AddCollaboratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCollaboratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCollaboratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
