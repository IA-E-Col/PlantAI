import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationHistoryComponent } from './validation-history.component';

describe('ValidationHistoryComponent', () => {
  let component: ValidationHistoryComponent;
  let fixture: ComponentFixture<ValidationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValidationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
