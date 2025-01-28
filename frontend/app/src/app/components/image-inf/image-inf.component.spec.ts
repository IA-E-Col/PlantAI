import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageInfComponent } from './image-inf.component';

describe('ImageInfComponent', () => {
  let component: ImageInfComponent;
  let fixture: ComponentFixture<ImageInfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageInfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageInfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
