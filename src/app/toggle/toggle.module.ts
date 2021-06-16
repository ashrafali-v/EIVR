import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleComponent,NgbdSortableHeader } from './toggle.component';
import { ToggleRoutingModule } from './toggle-routing.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
@NgModule({
  declarations: [ToggleComponent,NgbdSortableHeader],
  imports: [
    CommonModule,
    ToggleRoutingModule,
    FormsModule,
    NgbModule,
    ToastrModule,
    MalihuScrollbarModule.forRoot()
  ],providers:[
    ToastrService
  ]
})
export class ToggleModule { }
