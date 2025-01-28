import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreeModeleComponent } from './cree-modele.component';

describe('CreeModeleComponent', () => {
  let component: CreeModeleComponent;
  let fixture: ComponentFixture<CreeModeleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreeModeleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreeModeleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
