import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {
  transform(
    value: string,
    searchValue?: string,
    replaceValue?: string
  ): string {
    return searchValue ? value.replace(searchValue, replaceValue || '') : value;
  }
}
