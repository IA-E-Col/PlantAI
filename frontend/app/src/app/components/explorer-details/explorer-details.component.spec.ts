import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerDetailsComponent } from './explorer-details.component';

describe('ExplorerDetailsComponent', () => {
  let component: ExplorerDetailsComponent;
  let fixture: ComponentFixture<ExplorerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorerDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExplorerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
