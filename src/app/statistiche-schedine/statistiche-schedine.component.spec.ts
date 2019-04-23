import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticheSchedineComponent } from './statistiche-schedine.component';

describe('StatisticheSchedineComponent', () => {
  let component: StatisticheSchedineComponent;
  let fixture: ComponentFixture<StatisticheSchedineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticheSchedineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticheSchedineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
