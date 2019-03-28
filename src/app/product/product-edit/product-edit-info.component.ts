import { Component } from '@angular/core';

import { FormBase } from 'src/app/share/classes/form-base';

@Component({
  templateUrl: './product-edit-info.component.html',
  styleUrls: ['./product-edit-info.component.scss']
})
export class ProductEditInfoComponent extends FormBase {
  isFormValid(): boolean {
    return (
      this.isControlValid('productName') &&
      this.isControlValid('productCode') &&
      this.isControlValid('starRating')
    );
  }
}
