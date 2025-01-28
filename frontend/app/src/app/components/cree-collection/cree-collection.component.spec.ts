import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreeCollectionComponent } from './cree-collection.component';

describe('CreeCollectionComponent', () => {
  let component: CreeCollectionComponent;
  let fixture: ComponentFixture<CreeCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreeCollectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreeCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
