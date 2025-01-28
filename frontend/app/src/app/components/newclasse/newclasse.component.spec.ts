import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewclasseComponent } from './newclasse.component';

describe('NewclasseComponent', () => {
  let component: NewclasseComponent;
  let fixture: ComponentFixture<NewclasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewclasseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewclasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
