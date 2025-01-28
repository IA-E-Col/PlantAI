import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetInfComponent } from './dataset-inf.component';

describe('DatasetInfComponent', () => {
  let component: DatasetInfComponent;
  let fixture: ComponentFixture<DatasetInfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatasetInfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatasetInfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
