import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GererDatasetComponent } from './gerer-dataset.component';

describe('GererDatasetComponent', () => {
  let component: GererDatasetComponent;
  let fixture: ComponentFixture<GererDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GererDatasetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GererDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
