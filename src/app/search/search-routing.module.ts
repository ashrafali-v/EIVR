import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchComponent } from './search.component';
import { AuthGuard } from '../authGuard/auth.guard';
const routes: Routes = [{ path: '', component: SearchComponent,canActivate: [AuthGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
