import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarMesasPage } from './criar-mesas.page';

describe('CriarMesasPage', () => {
  let component: CriarMesasPage;
  let fixture: ComponentFixture<CriarMesasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriarMesasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriarMesasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
