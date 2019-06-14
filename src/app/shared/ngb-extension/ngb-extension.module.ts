import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DropdownAnchorDirective } from './dropdown/dropdown-anchor.directive';
import { DropdownBaseDirective } from './dropdown/dropdown-base.directive';
import { DropdownInputDirective } from './dropdown/dropdown-input.directive';
import { DropdownItemDirective } from './dropdown/dropdown-item.directive';
import { DropdownItemSelectorDirective } from './dropdown/dropdown-item-selector.directive';
import { DropdownMenuBaseDirective } from './dropdown/dropdown-menu-base.directive';
import { DropdownMenuDirective } from './dropdown/dropdown-menu.directive';
import { DropdownToggleDirective } from './dropdown/dropdown-toggle.directive';
import { DropdownDirective } from './dropdown/dropdown.directive';

@NgModule({
  imports: [CommonModule, NgbModule],
  declarations: [
    DropdownAnchorDirective,
    DropdownBaseDirective,
    DropdownInputDirective,
    DropdownItemDirective,
    DropdownItemSelectorDirective,
    DropdownMenuBaseDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    DropdownDirective
  ],
  exports: [
    NgbModule,
    DropdownAnchorDirective,
    DropdownBaseDirective,
    DropdownInputDirective,
    DropdownItemDirective,
    DropdownItemSelectorDirective,
    DropdownMenuBaseDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    DropdownDirective
  ]
})
export class NgbExtensionModule {}
