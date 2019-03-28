import { FormGroup, AbstractControl } from '@angular/forms';

export class FormBase {
  form: FormGroup;

  // Retrieves a child control given the control's name or path.
  get(path: string): AbstractControl {
    return this.form.get(path);
  }

  isControlValid(path: string): boolean {
    const control = this.get(path);
    return control.valid || !(control.touched || control.dirty);
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  hasError(path: string, errorCode: string): boolean {
    return this.get(path).hasError(errorCode);
  }

  errors(path: string): any {
    return this.form.get(path).errors;
  }

  markInvalidAsTouched(): void {
    if (!this.form.valid) {
      for (const name of Object.keys(this.form.controls)) {
        const c: AbstractControl = this.form.get(name);
        if (!c.value) {
          c.markAsTouched();
        }
      }
    }
  }
}
