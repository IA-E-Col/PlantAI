import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewprojetComponent } from './newprojet.component';

describe('NewprojetComponent', () => {
  let component: NewprojetComponent;
  let fixture: ComponentFixture<NewprojetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewprojetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewprojetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
