import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc24Component } from '../list/abc-24.component';
import { Abc24DetailComponent } from '../detail/abc-24-detail.component';
import { Abc24UpdateComponent } from '../update/abc-24-update.component';
import { Abc24RoutingResolveService } from './abc-24-routing-resolve.service';

const abc24Route: Routes = [
  {
    path: '',
    component: Abc24Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc24DetailComponent,
    resolve: {
      abc24: Abc24RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc24UpdateComponent,
    resolve: {
      abc24: Abc24RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc24UpdateComponent,
    resolve: {
      abc24: Abc24RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc24Route)],
  exports: [RouterModule],
})
export class Abc24RoutingModule {}
