import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReplacePipe } from './pipes/replace.pipe';
import { XrangePipe } from './pipes/xrange.pipe';

import { StarComponent } from './components/star/star.component';
import { MarkerComponent } from './components/marker/marker.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ReplacePipe, XrangePipe, StarComponent, MarkerComponent],
  exports: [ReplacePipe, XrangePipe, StarComponent, MarkerComponent]
})
export class ShareModule {}
