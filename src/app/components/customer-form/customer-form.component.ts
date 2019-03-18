import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import {
  FormGroup,
  FormControl,
  AbstractControl,
  FormBuilder
} from '@angular/forms';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  customer = new Customer();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: '',
      lastName: '',
      email: '',
      sendCatalog: true
    });

    // this.customerForm = new FormGroup({
    //   firstName: new FormControl(),
    //   lastName: new FormControl(),
    //   email: new FormControl(),
    //   sendCatalog: new FormControl(true)
    // });
  }

  get formValid(): boolean {
    return this.customerForm && this.customerForm.valid;
  }

  get firstName(): AbstractControl {
    return this.customerForm.get('firstName');
  }

  get lastName(): AbstractControl {
    return this.customerForm.get('lastName');
  }

  get email(): AbstractControl {
    return this.customerForm.get('email');
  }

  save() {
    console.log('Form:', this.customerForm);
    console.log('Saved:' + JSON.stringify(this.customerForm.value));
  }

  populateTestData(): void {
    this.customerForm.patchValue({
      firstName: 'Fame',
      lastName: 'Lame',
      email: 'fame@lame.com',
      sendCatalog: false
    });
  }
}
