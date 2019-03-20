import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import {
  FormGroup,
  FormControl,
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
  ValidatorFn,
  FormArray
} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

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
function validateRange(minValue: number, maxValue: number): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    if (
      c.value !== null &&
      (isNaN(c.value) || c.value < minValue || c.value > maxValue)
    ) {
      return { range: true };
    }
    return null;
  };
}

// function matchWith(getControl: () => AbstractControl | null): ValidatorFn {
//   return (c: AbstractControl): ValidationErrors | null => {
//     const o = getControl();
//     if (o && o.value !== c.value) {
//       return { match: true };
//     }
//     return null;
//   };
// }

function matchControls(a: string, b: string): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    const ac = c.get(a);
    const bc = c.get(b);
    if (ac && bc && ac.value !== bc.value) {
      return { match: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  // US states in JSON form [https://gist.github.com/mshafrir/2646763]
  states = {
    AL: 'Alabama',
    AK: 'Alaska',
    AS: 'American Samoa',
    AZ: 'Arizona',
    AR: 'Arkansas',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DE: 'Delaware',
    DC: 'District Of Columbia',
    FM: 'Federated States Of Micronesia',
    FL: 'Florida',
    GA: 'Georgia',
    GU: 'Guam',
    HI: 'Hawaii',
    ID: 'Idaho',
    IL: 'Illinois',
    IN: 'Indiana',
    IA: 'Iowa',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    ME: 'Maine',
    MH: 'Marshall Islands',
    MD: 'Maryland',
    MA: 'Massachusetts',
    MI: 'Michigan',
    MN: 'Minnesota',
    MS: 'Mississippi',
    MO: 'Missouri',
    MT: 'Montana',
    NE: 'Nebraska',
    NV: 'Nevada',
    NH: 'New Hampshire',
    NJ: 'New Jersey',
    NM: 'New Mexico',
    NY: 'New York',
    NC: 'North Carolina',
    ND: 'North Dakota',
    MP: 'Northern Mariana Islands',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PW: 'Palau',
    PA: 'Pennsylvania',
    PR: 'Puerto Rico',
    RI: 'Rhode Island',
    SC: 'South Carolina',
    SD: 'South Dakota',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VT: 'Vermont',
    VI: 'Virgin Islands',
    VA: 'Virginia',
    WA: 'Washington',
    WV: 'West Virginia',
    WI: 'Wisconsin',
    WY: 'Wyoming'
  };

  get stateAbbreviations(): string[] {
    return Object.keys(this.states);
  }

  mainForm: FormGroup;
  customer = new Customer();

  emailErrorMsg: string = '';

  // Retrieves a child control given the control's name or path.
  get(path: string): AbstractControl {
    return this.mainForm.get(path);
  }

  get addresses(): FormArray {
    return this.mainForm.get('addresses') as FormArray;
  }

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

  // matchWith(() => (this.mainForm ? this.mainForm.get('email') : null))

  createAddressGroup(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: null
    });
  }

  addAddressGroup(): void {
    this.addresses.push(this.createAddressGroup());
  }

  ngOnInit() {
    this.mainForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group(
        {
          email: ['', [Validators.required, Validators.email]],
          confirmEmail: ['', [Validators.required, Validators.email]]
        },
        { validators: [matchControls('email', 'confirmEmail')] }
      ),
      phone: '',
      notification: 'email',
      rating: [null, [validateRange(1, 5)]],
      sendCatalog: true,
      addresses: this.fb.array([this.createAddressGroup()])
    });

    this.mainForm
      .get('notification')
      .valueChanges.subscribe(value => this.setNotification(value));

    // this.mainForm.valueChanges.subscribe(value => {
    //   console.log('Change:', value);
    // });

    const email = this.mainForm.get('emailGroup.email');
    email.valueChanges.pipe(debounceTime(2000)).subscribe(value => {
      console.log('Email:', value);
      if (value && email.errors && email.errors.email) {
        this.emailErrorMsg = 'Please enter a valid email address.';
      } else {
        this.emailErrorMsg = '';
      }
    });
    // email.statusChanges.subscribe(value => {
    //   console.log('Email Status:', value);
    // });

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

  setNotification(notifyVia: string): void {
    const control = this.mainForm.get('phone');
    if (notifyVia === 'text') {
      control.setValidators(Validators.required);
    } else {
      control.clearValidators();
    }
    control.updateValueAndValidity();
  }

  populateTestData(): void {
    this.mainForm.patchValue({
      firstName: 'Fame',
      lastName: 'Lame',
      emailGroup: {
        email: 'fame@lame.com'
      },
      sendCatalog: false
    });
  }
}
