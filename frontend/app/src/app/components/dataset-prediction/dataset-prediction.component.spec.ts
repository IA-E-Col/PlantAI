import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetPredictionComponent } from './dataset-prediction.component';

describe('DatasetPredictionComponent', () => {
  let component: DatasetPredictionComponent;
  let fixture: ComponentFixture<DatasetPredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatasetPredictionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatasetPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
