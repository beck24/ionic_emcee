import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTimerPage } from './setup-timer.page';

describe('SetupTimerPage', () => {
  let component: SetupTimerPage;
  let fixture: ComponentFixture<SetupTimerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupTimerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupTimerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
