import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificaSchedineComponent } from './classifica-schedine.component';

describe('ClassificaSchedineComponent', () => {
  let component: ClassificaSchedineComponent;
  let fixture: ComponentFixture<ClassificaSchedineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassificaSchedineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificaSchedineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
