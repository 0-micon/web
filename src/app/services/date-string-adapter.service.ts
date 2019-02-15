import { Injectable } from "@angular/core";
import { NgbDateAdapter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

const _ = "-";

export function toNgbDateStruct(value: string): NgbDateStruct {
  if (value) {
    const split = value.split(_);
    return {
      year: parseInt(split[0], 10),
      month: parseInt(split[1], 10),
      day: parseInt(split[2], 10)
    };
  }
  return { year: 0, month: 0, day: 0 };
}

export function fromNgbDateStruct(date: NgbDateStruct): string {
  if (date) {
    return (
      date.year +
      _ +
      (date.month < 10 ? "0" : "") +
      date.month +
      _ +
      (date.day < 10 ? "0" : "") +
      date.day
    );
  }
  return "";
}

@Injectable({
  providedIn: "root"
})
export class DateStringAdapterService implements NgbDateAdapter<string> {
  fromModel(value: string): NgbDateStruct {
    return toNgbDateStruct(value);
  }

  toModel(date: NgbDateStruct): string {
    return fromNgbDateStruct(date);
  }
}
