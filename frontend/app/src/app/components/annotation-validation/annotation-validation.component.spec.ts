import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationValidationComponent } from './annotation-validation.component';

describe('AnnotationValidationComponent', () => {
  let component: AnnotationValidationComponent;
  let fixture: ComponentFixture<AnnotationValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnotationValidationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnnotationValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
