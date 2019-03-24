import { FormGroup } from '@angular/forms';

export interface IErrorMessages {
  [controlName: string]: string;
}

export interface IValidationMessages {
  [controlName: string]: IErrorMessages;
}

export class GenericValidator {
  static filter(
    container: FormGroup,
    validationMessages: IValidationMessages,
    resultMessages: IErrorMessages = {}
  ): IErrorMessages {
    for (const name of Object.keys(container.controls)) {
      const control = container.controls[name];
      if (control instanceof FormGroup) {
        GenericValidator.filter(control, validationMessages, resultMessages);
      } else {
        // Only validate if there is a validation message for the control
        if (validationMessages[name]) {
          resultMessages[name] = '';
          if ((control.dirty || control.touched) && control.errors) {
            Object.keys(control.errors).map(error => {
              resultMessages[name] += validationMessages[name][error] + ' ';
            });
          }
        }
      }
    }
    return resultMessages;
  }
}
