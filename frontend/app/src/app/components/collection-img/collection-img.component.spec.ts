import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionImgComponent } from './collection-img.component';

describe('CollectionImgComponent', () => {
  let component: CollectionImgComponent;
  let fixture: ComponentFixture<CollectionImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionImgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollectionImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});