import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreecellGameComponent } from './freecell-game.component';

describe('FreecellGameComponent', () => {
  let component: FreecellGameComponent;
  let fixture: ComponentFixture<FreecellGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecellGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecellGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
