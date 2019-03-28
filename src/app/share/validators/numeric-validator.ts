import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export class NumericValidator {
  static range(minValue: number, maxValue: number): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      const v = c.value;
      if (v !== null && v !== '') {
        const n: number = +v;
        if (isNaN(n) || n < minValue || n > maxValue) {
          return { range: true };
        }
      }
      return null;
    };
  }
  static rangeRequired(minValue: number, maxValue: number): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      const n: number = +c.value;
      if (isNaN(n) || n < minValue || n > maxValue) {
        return { range: true };
      }
      return null;
    };
  }
}
