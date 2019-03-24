import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export class NumericValidator {
  static range(minValue: number, maxValue: number): ValidatorFn {
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
  static rangeRequired(minValue: number, maxValue: number): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
      if (isNaN(c.value) || c.value < minValue || c.value > maxValue) {
        return { range: true };
      }
      return null;
    };
  }
}
