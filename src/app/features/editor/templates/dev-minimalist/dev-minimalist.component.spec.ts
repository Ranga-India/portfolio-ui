import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevMinimalistComponent } from './dev-minimalist.component';

describe('DevMinimalistComponent', () => {
  let component: DevMinimalistComponent;
  let fixture: ComponentFixture<DevMinimalistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevMinimalistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DevMinimalistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
