import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc3Component } from '../list/abc-3.component';
import { Abc3DetailComponent } from '../detail/abc-3-detail.component';
import { Abc3UpdateComponent } from '../update/abc-3-update.component';
import { Abc3RoutingResolveService } from './abc-3-routing-resolve.service';

const abc3Route: Routes = [
  {
    path: '',
    component: Abc3Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc3DetailComponent,
    resolve: {
      abc3: Abc3RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc3UpdateComponent,
    resolve: {
      abc3: Abc3RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc3UpdateComponent,
    resolve: {
      abc3: Abc3RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc3Route)],
  exports: [RouterModule],
})
export class Abc3RoutingModule {}
