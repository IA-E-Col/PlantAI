import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionInfComponent } from './collection-inf.component';

describe('CollectionInfComponent', () => {
  let component: CollectionInfComponent;
  let fixture: ComponentFixture<CollectionInfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionInfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollectionInfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
