import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MessageComponent } from './message/message.component';

@NgModule({
  declarations: [MessageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: 'messages', component: MessageComponent, outlet: 'popup' }])
  ]
})
export class MessagesModule {}
