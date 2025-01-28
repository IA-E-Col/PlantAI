import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelInfComponent } from './model-inf.component';

describe('ModelInfComponent', () => {
  let component: ModelInfComponent;
  let fixture: ComponentFixture<ModelInfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelInfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModelInfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
