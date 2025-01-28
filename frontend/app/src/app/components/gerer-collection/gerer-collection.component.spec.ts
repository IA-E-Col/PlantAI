import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GererCollectionComponent } from './gerer-collection.component';

describe('GererCollectionComponent', () => {
  let component: GererCollectionComponent;
  let fixture: ComponentFixture<GererCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GererCollectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GererCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
