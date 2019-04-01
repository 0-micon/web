import { TestBed } from '@angular/core/testing';

import { ProductParamsService } from './product-params.service';

describe('ProductParamsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductParamsService = TestBed.get(ProductParamsService);
    expect(service).toBeTruthy();
  });
});
