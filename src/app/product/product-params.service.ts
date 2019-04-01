import { Injectable } from '@angular/core';

@Injectable()
export class ProductParamsService {
  showImage: boolean = false;
  filterBy: string = '';

  constructor() {}
}
