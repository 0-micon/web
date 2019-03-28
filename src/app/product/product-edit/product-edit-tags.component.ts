import { Component, OnInit } from '@angular/core';
import { FormBase } from 'src/app/share/classes/form-base';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  templateUrl: './product-edit-tags.component.html',
  styleUrls: ['./product-edit-tags.component.scss']
})
export class ProductEditTagsComponent extends FormBase implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}

  get tags(): FormArray {
    return this.get('tags') as FormArray;
  }

  addTag(tag: string = ''): void {
    this.tags.push(new FormControl(tag));
  }

  deleteTag(i: number): void {
    const tags = this.tags;
    tags.removeAt(i);
    tags.markAsDirty();
  }

  isFormValid(): boolean {
    return this.tags.valid;
  }
}
