import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameEditModalComponent } from './frame-edit-modal.component';

describe('FrameEditModalComponent', () => {
  let component: FrameEditModalComponent;
  let fixture: ComponentFixture<FrameEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
