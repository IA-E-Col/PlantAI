import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportannotationComponent } from './exportannotation.component';

describe('ExportannotationComponent', () => {
  let component: ExportannotationComponent;
  let fixture: ComponentFixture<ExportannotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportannotationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportannotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
