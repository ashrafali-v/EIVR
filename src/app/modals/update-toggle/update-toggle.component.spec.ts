import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateToggleComponent } from './update-toggle.component';

describe('UpdateToggleComponent', () => {
  let component: UpdateToggleComponent;
  let fixture: ComponentFixture<UpdateToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
