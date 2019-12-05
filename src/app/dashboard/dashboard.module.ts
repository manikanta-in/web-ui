import { SharedModule } from './../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { UserComponent } from './components/user/user.component';



@NgModule({
  declarations: [DashboardComponent, UserComponent],
  imports: [
    CommonModule, SharedModule, DashboardRoutingModule
  ]
})
export class DashboardModule { }
