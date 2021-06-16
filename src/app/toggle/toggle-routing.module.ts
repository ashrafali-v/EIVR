import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToggleComponent } from './toggle.component';
import { AuthGuard } from '../authGuard/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: ToggleComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToggleRoutingModule { }