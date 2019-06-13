import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
  DropdownDirective,
  // DropdownItemDirective,
  // DropdownMenuBaseDirective,
  // DropdownMenuDirective,
  DropdownAnchorDirective,
  DropdownToggleDirective,
  DropdownInputDirective,
  // DropdownItemSelectorDirective
} from './dropdown/dropdown.directive';

import { DropdownItemDirective } from './dropdown/dropdown-item.directive';
import { DropdownMenuBaseDirective } from './dropdown/dropdown-menu-base.directive';
import { DropdownMenuDirective } from './dropdown/dropdown-menu.directive';
// import { DropdownAnchorDirective } from './dropdown/dropdown-anchor.directive';
// import { DropdownToggleDirective } from './dropdown/dropdown-toggle.directive';
// import { DropdownInputDirective } from './dropdown/dropdown-input.directive';
import { DropdownItemSelectorDirective } from './dropdown/dropdown-item-selector.directive';

@NgModule({
  imports: [CommonModule, NgbModule],
  declarations: [
    DropdownItemDirective,
    DropdownMenuBaseDirective,
    DropdownMenuDirective,
    DropdownAnchorDirective,
    DropdownToggleDirective,
    DropdownDirective,
    DropdownInputDirective,
    DropdownItemSelectorDirective
  ],
  exports: [
    NgbModule,
    DropdownItemDirective,
    DropdownMenuBaseDirective,
    DropdownMenuDirective,
    DropdownAnchorDirective,
    DropdownToggleDirective,
    DropdownDirective,
    DropdownInputDirective,
    DropdownItemSelectorDirective
  ]
})
export class NgbExtensionModule {}
