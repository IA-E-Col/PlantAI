import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjbarComponent } from './projbar.component';

describe('ProjbarComponent', () => {
  let component: ProjbarComponent;
  let fixture: ComponentFixture<ProjbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
