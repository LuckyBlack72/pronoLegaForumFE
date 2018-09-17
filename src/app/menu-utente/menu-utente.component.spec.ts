import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuUtenteComponent } from './menu-utente.component';

describe('MenuUtenteComponent', () => {
  let component: MenuUtenteComponent;
  let fixture: ComponentFixture<MenuUtenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuUtenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuUtenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
