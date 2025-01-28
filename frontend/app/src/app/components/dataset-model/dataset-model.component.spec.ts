import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetModelComponent } from './dataset-model.component';

describe('DatasetModelComponent', () => {
  let component: DatasetModelComponent;
  let fixture: ComponentFixture<DatasetModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatasetModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatasetModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
