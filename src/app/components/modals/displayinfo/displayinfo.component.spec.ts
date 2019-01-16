import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayinfoComponent } from './displayinfo.component';

describe('DisplayinfoComponent', () => {
  let component: DisplayinfoComponent;
  let fixture: ComponentFixture<DisplayinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
