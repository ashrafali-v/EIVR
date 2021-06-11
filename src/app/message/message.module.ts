import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MessageComponent,NgbdSortableHeader } from './message.component';
import { MessageRoutingModule } from './message-routing.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
@NgModule({
  declarations: [MessageComponent,NgbdSortableHeader],
  imports: [
    CommonModule,
    MessageRoutingModule,
    FormsModule,
    NgbModule,
    ToastrModule,
    MalihuScrollbarModule.forRoot()
  ],providers:[
    ToastrService
  ]
})
export class MessageModule { }
