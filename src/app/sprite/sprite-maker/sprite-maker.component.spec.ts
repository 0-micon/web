import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpriteMakerComponent } from './sprite-maker.component';

describe('SpriteMakerComponent', () => {
  let component: SpriteMakerComponent;
  let fixture: ComponentFixture<SpriteMakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpriteMakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpriteMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
