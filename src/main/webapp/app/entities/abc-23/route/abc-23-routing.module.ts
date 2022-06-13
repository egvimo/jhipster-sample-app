import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc23Component } from '../list/abc-23.component';
import { Abc23DetailComponent } from '../detail/abc-23-detail.component';
import { Abc23UpdateComponent } from '../update/abc-23-update.component';
import { Abc23RoutingResolveService } from './abc-23-routing-resolve.service';

const abc23Route: Routes = [
  {
    path: '',
    component: Abc23Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc23DetailComponent,
    resolve: {
      abc23: Abc23RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc23UpdateComponent,
    resolve: {
      abc23: Abc23RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc23UpdateComponent,
    resolve: {
      abc23: Abc23RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc23Route)],
  exports: [RouterModule],
})
export class Abc23RoutingModule {}
