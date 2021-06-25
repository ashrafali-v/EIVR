import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UpdateMessageComponent } from './modals/update-message/update-message.component';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './aside/aside.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ViewMessageComponent } from './modals/view-message/view-message.component';
import { DeleteMessageComponent } from './modals/delete-message/delete-message.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateToggleComponent } from './modals/create-toggle/create-toggle.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HttpInterceptorProviders } from '../app/httpInterceptors/interceptor.providers';
import { UserLogComponent } from './modals/user-log/user-log.component';
import { ViewLogComponent } from './modals/view-log/view-log.component';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { UpdateToggleComponent } from './modals/update-toggle/update-toggle.component';
@NgModule({
  declarations: [
    AppComponent,
    UpdateMessageComponent,
    HeaderComponent,
    AsideComponent,
    FooterComponent,
    ViewMessageComponent,
    DeleteMessageComponent,
    CreateToggleComponent,
    UserLogComponent,
    ViewLogComponent,
    UpdateToggleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NgbModule,
    NgxChartsModule,
    ToastrModule.forRoot({
      closeButton: true}),
    MalihuScrollbarModule.forRoot()
  ],
  providers: [HttpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
