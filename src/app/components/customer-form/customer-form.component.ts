import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  customer = new Customer();

  constructor() {}

  ngOnInit() {}

  save(customerForm: NgForm) {
    console.log('Form:', customerForm);
    console.log('Saved:' + JSON.stringify(customerForm.value));
  }
}
