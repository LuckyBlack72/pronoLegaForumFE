import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudCompetizioneComponent } from './crud-competizione.component';

describe('CrudCompetizioneComponent', () => {
  let component: CrudCompetizioneComponent;
  let fixture: ComponentFixture<CrudCompetizioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudCompetizioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudCompetizioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
