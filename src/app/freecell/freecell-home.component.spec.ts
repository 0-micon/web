import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreecellHomeComponent } from './freecell-home.component';

describe('FreecellHomeComponent', () => {
  let component: FreecellHomeComponent;
  let fixture: ComponentFixture<FreecellHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecellHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecellHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
