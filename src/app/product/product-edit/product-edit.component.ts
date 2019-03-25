import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormArray,
  FormControl
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NumericValidator } from 'src/app/share/validators/numeric-validator';
import { debounceTime } from 'rxjs/operators';

import {
  IValidationMessages,
  IErrorMessages,
  GenericValidator
} from 'src/app/share/validators/generic-validator';
import { ProductService } from 'src/app/product/product.service';

import { Product, IProduct } from 'src/app/product/product';

// const validationMessages: IValidationMessages = {
//   productName: {
//     required: 'Product name is required.',
//     minlength: 'Product name is too short.',
//     maxlength: 'Product name is too long'
//   },
//   productCode: {
//     required: 'Product code is required.'
//   },
//   starRating: {
//     range: 'Rate the product between 1 (lowest) and 5 (highest).'
//   }
// };

class FormBase {
  form: FormGroup;

  // Retrieves a child control given the control's name or path.
  get(path: string): AbstractControl {
    return this.form.get(path);
  }

  isControlValid(path: string): boolean {
    const control = this.get(path);
    return control.valid || !(control.touched || control.dirty);
  }

  hasError(path: string, errorCode: string): boolean {
    return this.get(path).hasError(errorCode);
  }

  errors(path: string): any {
    return this.form.get(path).errors;
  }
}

@Component({
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent extends FormBase implements OnInit, AfterViewInit, OnDestroy {
  subscription: Subscription;
  pageTitle: string = '';
  product: IProduct;
  errorMessage: string;

  get tags(): FormArray {
    return this.get('tags') as FormArray;
  }

  addTag(tag: string = ''): void {
    this.tags.push(new FormControl(tag));
  }

  deleteTag(i: number): void {
    const tags = this.tags;
    tags.removeAt(i);
    tags.markAsDirty();
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      productName: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      productCode: ['', [Validators.minLength(3), Validators.maxLength(32)]],
      starRating: [null, [NumericValidator.range(1, 5)]],
      tags: this.fb.array([]),
      description: ''
    });

    this.subscription = this.route.params.subscribe(params => {
      console.log('Product Route:', params);
      this.getProduct(+params.id);
    });
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
      console.log('Form Update:', value);
      // this.errorMessages = GenericValidator.filter(this.form, validationMessages);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getProduct(id: number): void {
    this.productService.getProduct(id).subscribe(
      product => {
        this.errorMessage = null;
        this.product = product;
        this.displayProduct();
      },
      error => {
        this.errorMessage = error;
      }
    );
  }

  displayProduct(): void {
    const product: IProduct = this.product;
    if (!product) {
      return;
    }

    if (product.id) {
      this.pageTitle = 'Edit product';
    } else {
      this.pageTitle = 'Add new product';
    }

    // Update the data on the form
    if (this.form) {
      this.form.reset();
      this.form.patchValue({
        productName: product.productName,
        productCode: product.productCode,
        starRating: product.starRating,
        description: product.description
      });
      this.tags.reset();
      if (product.tags) {
        for (const tag of product.tags) {
          this.addTag(tag);
        }
      }
    }
  }

  save(): void {
    if (this.form.valid) {
      if (this.form.dirty) {
        const product = { ...this.product, ...this.form.value };
        this.productService
          .updateProduct(product)
          .subscribe(() => this.onSaveComplete(), error => (this.errorMessage = error));
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.form.reset();
    this.router.navigate(['/products']);
  }

  deleteProduct(): void {}
}
