import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudCompetizioneSettimanaleComponent } from './crud-competizione-settimanale.component';

describe('CrudCompetizioneSettimanaleComponent', () => {
  let component: CrudCompetizioneSettimanaleComponent;
  let fixture: ComponentFixture<CrudCompetizioneSettimanaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudCompetizioneSettimanaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudCompetizioneSettimanaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
