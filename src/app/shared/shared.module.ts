import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgbExtensionModule } from './ngb-extension/ngb-extension.module';

import { XrangePipe } from './pipes/xrange.pipe';
import { FormLabelComponent } from './components/form-label/form-label.component';
import { SimpleVirtualListComponent } from './components/simple-virtual-list/simple-virtual-list.component';
import { MultiButtonComponent } from './components/multi-button/multi-button.component';
import { MultiButtonToolbarComponent } from './components/multi-button-toolbar/multi-button-toolbar.component';
import { DropdownInputComponent } from './components/dropdown-input/dropdown-input.component';
import { SqueezeBoxComponent } from './components/squeeze-box/squeeze-box.component';

@NgModule({
  declarations: [
    XrangePipe,
    DropdownInputComponent,
    FormLabelComponent,
    SimpleVirtualListComponent,
    MultiButtonComponent,
    MultiButtonToolbarComponent,
    SqueezeBoxComponent
  ],
  imports: [CommonModule, FormsModule, NgbExtensionModule],
  exports: [
    NgbExtensionModule,
    DropdownInputComponent,
    XrangePipe,
    FormLabelComponent,
    SimpleVirtualListComponent,
    MultiButtonComponent,
    MultiButtonToolbarComponent,
    SqueezeBoxComponent
  ]
})
export class SharedModule {}
