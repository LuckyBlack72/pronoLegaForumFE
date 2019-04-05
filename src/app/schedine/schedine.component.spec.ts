import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedineComponent } from './schedine.component';

describe('SchedineComponent', () => {
  let component: SchedineComponent;
  let fixture: ComponentFixture<SchedineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
