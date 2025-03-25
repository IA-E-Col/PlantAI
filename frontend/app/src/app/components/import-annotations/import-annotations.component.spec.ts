import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAnnotationsComponent } from './import-annotations.component';

describe('ImportAnnotationsComponent', () => {
  let component: ImportAnnotationsComponent;
  let fixture: ComponentFixture<ImportAnnotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportAnnotationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
