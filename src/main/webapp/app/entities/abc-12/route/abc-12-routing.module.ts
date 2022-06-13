import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc12Component } from '../list/abc-12.component';
import { Abc12DetailComponent } from '../detail/abc-12-detail.component';
import { Abc12UpdateComponent } from '../update/abc-12-update.component';
import { Abc12RoutingResolveService } from './abc-12-routing-resolve.service';

const abc12Route: Routes = [
  {
    path: '',
    component: Abc12Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc12DetailComponent,
    resolve: {
      abc12: Abc12RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc12UpdateComponent,
    resolve: {
      abc12: Abc12RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc12UpdateComponent,
    resolve: {
      abc12: Abc12RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc12Route)],
  exports: [RouterModule],
})
export class Abc12RoutingModule {}
