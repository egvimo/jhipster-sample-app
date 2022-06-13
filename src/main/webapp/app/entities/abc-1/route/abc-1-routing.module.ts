import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc1Component } from '../list/abc-1.component';
import { Abc1DetailComponent } from '../detail/abc-1-detail.component';
import { Abc1UpdateComponent } from '../update/abc-1-update.component';
import { Abc1RoutingResolveService } from './abc-1-routing-resolve.service';

const abc1Route: Routes = [
  {
    path: '',
    component: Abc1Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc1DetailComponent,
    resolve: {
      abc1: Abc1RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc1UpdateComponent,
    resolve: {
      abc1: Abc1RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc1UpdateComponent,
    resolve: {
      abc1: Abc1RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc1Route)],
  exports: [RouterModule],
})
export class Abc1RoutingModule {}
