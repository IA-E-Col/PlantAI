import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionDashboardComponent } from './collection-dashboard.component';

describe('CollectionDashboardComponent', () => {
  let component: CollectionDashboardComponent;
  let fixture: ComponentFixture<CollectionDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollectionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
