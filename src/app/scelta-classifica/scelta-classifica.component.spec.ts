import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SceltaClassificaComponent } from './scelta-classifica.component';

describe('SceltaClassificaComponent', () => {
  let component: SceltaClassificaComponent;
  let fixture: ComponentFixture<SceltaClassificaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SceltaClassificaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SceltaClassificaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
