import { Injectable } from "@angular/core";
import { NgbDateAdapter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { toInteger } from "@ng-bootstrap/ng-bootstrap/util/util";

const _ = "-";

@Injectable({
  providedIn: "root"
})
export class DateStringAdapterService implements NgbDateAdapter<string> {
  fromModel(value: string): NgbDateStruct {
    if (value) {
      const split = value.split(_);
      return {
        year: toInteger(split[0]),
        month: toInteger(split[1]),
        day: toInteger(split[2])
      };
    }
    return { year: 0, month: 0, day: 0 };
  }

  toModel(date: NgbDateStruct): string {
    if (date) {
      return date.year + _ + date.month + _ + date.day;
    }
    return "";
  }
}
