import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DropdownItemDirective } from './dropdown/dropdown-item.directive';
import { DropdownMenuDirective } from './dropdown/dropdown-menu.directive';
import { DropdownAnchorDirective } from './dropdown/dropdown-anchor.directive';
import { DropdownToggleDirective } from './dropdown/dropdown-toggle.directive';
import { DropdownDirective } from './dropdown/dropdown.directive';
import { DropdownInputDirective } from './dropdown/dropdown-input.directive';
import { DropdownMenuBaseDirective } from './dropdown/dropdown-menu-base.directive';
import { DropdownItemSelectorDirective } from './dropdown/dropdown-item-selector.directive';

@NgModule({
  declarations: [
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownAnchorDirective,
    DropdownToggleDirective,
    DropdownDirective,
    DropdownInputDirective,
    DropdownMenuBaseDirective,
    DropdownItemSelectorDirective
  ],
  imports: [CommonModule, NgbModule],
  exports: [
    NgbModule,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownAnchorDirective,
    DropdownToggleDirective,
    DropdownDirective
  ]
})
export class NgbExtensionModule {}
