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

// import { ProductService } from 'src/app/product/product.service';

import { IProduct } from 'src/app/product/product';
import { IResolvedProduct } from '../product-resolver.service';
import { FormBase } from 'src/app/share/classes/form-base';
import { ProductEditInfoComponent } from './product-edit-info.component';
import { ProductEditTagsComponent } from './product-edit-tags.component';

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

@Component({
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent extends FormBase implements OnInit, AfterViewInit, OnDestroy {
  subscription: Subscription;
  pageTitle: string = '';
  product: IProduct;
  errorMessage: string;

  constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
    // private productService: ProductService
  ) {
    super();
  }

  get info(): FormGroup {
    return this.get('info') as FormGroup;
  }

  get tags(): FormArray {
    return this.get('tags') as FormArray;
  }

  ngOnInit() {
    const fb = this._fb;
    this.form = fb.group({
      info: fb.group({
        productName: ['', [Validators.minLength(3), Validators.maxLength(50)]],
        productCode: ['', [Validators.minLength(3), Validators.maxLength(32)]],
        starRating: [null, [NumericValidator.range(1, 5)]],
        description: ''
      }),
      tags: fb.array([])
    });

    this.subscription = this.route.data.subscribe(params => {
      const data: IResolvedProduct = params.product; // this.route.snapshot.data.product;
      // console.log('Data 1:', data);
      // console.log('Data 2:', params);
      this.errorMessage = data.error;
      this.product = data.product;
      this.displayProduct();
    });

    // this.route.params.subscribe(params => {
    //   console.log('Product Route:', params);
    //   this.getProduct(+params.id);
    // });
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

  // getProduct(id: number): void {
  //   this.productService.getProduct(id).subscribe(
  //     product => {
  //       this.errorMessage = null;
  //       this.product = product;
  //       this.displayProduct();
  //     },
  //     error => {
  //       this.errorMessage = error;
  //     }
  //   );
  // }

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

      this.info.patchValue({
        productName: product.productName,
        productCode: product.productCode,
        starRating: product.starRating,
        description: product.description
      });

      const tags: FormArray = this.tags;
      while (tags.length > 0) {
        tags.removeAt(tags.length - 1);
      }
      tags.reset();
      if (product.tags) {
        for (const name of product.tags) {
          tags.push(new FormControl(name));
        }
      }
    }
  }

  save(): void {
    if (this.form.valid) {
      if (this.form.dirty) {
        const product = {
          ...this.product,
          ...this.info.value,
          tags: this.tags.controls.map(c => c.value)
        };
        // this.productService
        //   .updateProduct(product)
        //   .subscribe(() => this.onSaveComplete(), error => (this.errorMessage = error));
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

  onActivate($event): void {
    // console.log('On Activate:', $event);

    if ($event instanceof FormBase) {
      if ($event instanceof ProductEditInfoComponent) {
        $event.form = this.info;
      } else if ($event instanceof ProductEditTagsComponent) {
        $event.form = this.form;
      }
    }
  }

  onDeactivate($event): void {
    // console.log('On Deactivate:', $event);

    if ($event instanceof FormBase) {
      $event.markInvalidAsTouched();
    }
  }
}
