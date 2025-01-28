import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDatasetComponent } from './dashboard-dataset.component';

describe('DashboardDatasetComponent', () => {
  let component: DashboardDatasetComponent;
  let fixture: ComponentFixture<DashboardDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardDatasetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
