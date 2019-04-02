import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductShellInfoComponent } from './product-shell-info.component';

describe('ProductShellInfoComponent', () => {
  let component: ProductShellInfoComponent;
  let fixture: ComponentFixture<ProductShellInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductShellInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductShellInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
