import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteinfoComponent } from './remoteinfo.component';

describe('RemoteinfoComponent', () => {
  let component: RemoteinfoComponent;
  let fixture: ComponentFixture<RemoteinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoteinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
