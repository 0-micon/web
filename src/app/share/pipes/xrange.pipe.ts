import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'xrange'
})
export class XrangePipe implements PipeTransform {
  transform(value: number): Iterable<number> {
    return {
      *[Symbol.iterator]() {
        for (let i = 0; i < value; i++) {
          yield i;
        }
      }
    };
  }
}
