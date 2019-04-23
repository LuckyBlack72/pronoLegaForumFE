import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SceltaStatisticheComponent } from './scelta-statistiche.component';

describe('SceltaStatisticheComponent', () => {
  let component: SceltaStatisticheComponent;
  let fixture: ComponentFixture<SceltaStatisticheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SceltaStatisticheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SceltaStatisticheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
