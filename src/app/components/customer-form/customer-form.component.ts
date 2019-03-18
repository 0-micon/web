import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import {
  FormGroup,
  FormControl,
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators
} from '@angular/forms';

// class FormBase {
//   mainForm: FormGroup;

//   isControlValid(controlName: string): boolean {
//     const control = this.mainForm.get(controlName);
//     return control.valid || !(control.touched || control.dirty);
//   }

//   getErrors(controlName: string): any {
//     return this.mainForm.get(controlName).errors;
//   }

//   constructor(controls: string[] = []) {
//     for (const control of controls) {
//       this.defineControlGetters(control);
//     }
//   }

//   defineControlGetters(controlName: string): void {
//     Object.defineProperty(this, controlName, {
//       get(): AbstractControl {
//         return this.mainForm.get(controlName);
//       }
//     });
//     Object.defineProperty(this, `${controlName}Errors`, {
//       get(): any {
//         return this[controlName].errors;
//       }
//     });

//     const uName =
//       controlName.substring(0, 1).toUpperCase() + controlName.substring(1);
//     Object.defineProperty(this, `is${uName}Valid`, {
//       get(): boolean {
//         const control = this[controlName];
//         return control.valid || !(control.touched || control.dirty);
//       }
//     });
//   }
// }

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  mainForm: FormGroup;
  customer = new Customer();

  isControlValid(controlName: string): boolean {
    const control = this.mainForm.get(controlName);
    return control.valid || !(control.touched || control.dirty);
  }

  getErrors(controlName: string): any {
    return this.mainForm.get(controlName).errors;
  }

  constructor(private fb: FormBuilder) {
    // super(['firstName', 'lastName', 'email', 'sendCatalog']);
  }

  ngOnInit() {
    this.mainForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      sendCatalog: true
    });

    // Object.defineProperty(this, 'isEmailValid', {
    //   get(): boolean {
    //     const control = this.email;
    //     return control.valid || !(control.touched || control.dirty);
    //   }
    // });

    // this.customerForm = new FormGroup({
    //   firstName: new FormControl(),
    //   lastName: new FormControl(),
    //   email: new FormControl(),
    //   sendCatalog: new FormControl(true)
    // });
  }

  get formValid(): boolean {
    return this.mainForm && this.mainForm.valid;
  }

  // get firstName(): AbstractControl {
  //   return this.mainForm.get('firstName');
  // }

  // get firstNameErrors(): any {
  //   return this.firstName.errors;
  // }

  // get isFirstNameValid(): boolean {
  //   const control = this.firstName;
  //   return control.valid || !(control.touched || control.dirty);
  // }

  // get lastName(): AbstractControl {
  //   return this.mainForm.get('lastName');
  // }

  // get lastNameErrors(): any {
  //   return this.lastName.errors;
  // }

  // get isLastNameValid(): boolean {
  //   const control = this.lastName;
  //   return control.valid || !(control.touched || control.dirty);
  // }

  // get email(): AbstractControl {
  //   return this.mainForm.get('email');
  // }

  save() {
    console.log('Form:', this.mainForm);
    console.log('Saved:' + JSON.stringify(this.mainForm.value));
  }

  populateTestData(): void {
    this.mainForm.patchValue({
      firstName: 'Fame',
      lastName: 'Lame',
      email: 'fame@lame.com',
      sendCatalog: false
    });
  }
}
