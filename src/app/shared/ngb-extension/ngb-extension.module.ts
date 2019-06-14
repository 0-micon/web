import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
  DropdownDirective,
  // DropdownItemDirective,
  // DropdownMenuBaseDirective,
  // DropdownMenuDirective,
  // DropdownAnchorDirective,
  // DropdownInputDirective,
  // DropdownToggleDirective,
  // DropdownItemSelectorDirective
} from './dropdown/dropdown.directive';

import { DropdownItemDirective } from './dropdown/dropdown-item.directive';
import { DropdownMenuBaseDirective } from './dropdown/dropdown-menu-base.directive';
import { DropdownMenuDirective } from './dropdown/dropdown-menu.directive';
import { DropdownAnchorDirective } from './dropdown/dropdown-anchor.directive';
import { DropdownInputDirective } from './dropdown/dropdown-input.directive';
import { DropdownToggleDirective } from './dropdown/dropdown-toggle.directive';
import { DropdownItemSelectorDirective } from './dropdown/dropdown-item-selector.directive';
import { DropdownBaseDirective } from './dropdown/dropdown-base.directive';

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
    DropdownItemSelectorDirective,
    DropdownBaseDirective
  ],
  exports: [
    NgbModule,
    DropdownBaseDirective,
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
