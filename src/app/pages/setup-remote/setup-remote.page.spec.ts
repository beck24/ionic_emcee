import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupRemotePage } from './setup-remote.page';

describe('SetupRemotePage', () => {
  let component: SetupRemotePage;
  let fixture: ComponentFixture<SetupRemotePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupRemotePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupRemotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
