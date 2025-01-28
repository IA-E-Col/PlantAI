import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GererprojetComponent } from './gererprojet.component';

describe('GererprojetComponent', () => {
  let component: GererprojetComponent;
  let fixture: ComponentFixture<GererprojetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GererprojetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GererprojetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
