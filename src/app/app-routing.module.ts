import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AppComponent } from './app.component';
import { DashboardModule } from './dashboard/dashboard.module';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [{ path: '', component: AppComponent, pathMatch: 'full' }],
  },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    loadChildren: () => DashboardModule
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
