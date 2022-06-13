import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc14Component } from '../list/abc-14.component';
import { Abc14DetailComponent } from '../detail/abc-14-detail.component';
import { Abc14UpdateComponent } from '../update/abc-14-update.component';
import { Abc14RoutingResolveService } from './abc-14-routing-resolve.service';

const abc14Route: Routes = [
  {
    path: '',
    component: Abc14Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc14DetailComponent,
    resolve: {
      abc14: Abc14RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc14UpdateComponent,
    resolve: {
      abc14: Abc14RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc14UpdateComponent,
    resolve: {
      abc14: Abc14RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc14Route)],
  exports: [RouterModule],
})
export class Abc14RoutingModule {}
