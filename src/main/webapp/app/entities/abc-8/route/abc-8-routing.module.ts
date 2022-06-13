import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc8Component } from '../list/abc-8.component';
import { Abc8DetailComponent } from '../detail/abc-8-detail.component';
import { Abc8UpdateComponent } from '../update/abc-8-update.component';
import { Abc8RoutingResolveService } from './abc-8-routing-resolve.service';

const abc8Route: Routes = [
  {
    path: '',
    component: Abc8Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc8DetailComponent,
    resolve: {
      abc8: Abc8RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc8UpdateComponent,
    resolve: {
      abc8: Abc8RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc8UpdateComponent,
    resolve: {
      abc8: Abc8RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc8Route)],
  exports: [RouterModule],
})
export class Abc8RoutingModule {}
