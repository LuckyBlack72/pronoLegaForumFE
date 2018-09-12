import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PronosticiComponent } from './pronostici.component';

describe('PronosticiComponent', () => {
  let component: PronosticiComponent;
  let fixture: ComponentFixture<PronosticiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PronosticiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PronosticiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
