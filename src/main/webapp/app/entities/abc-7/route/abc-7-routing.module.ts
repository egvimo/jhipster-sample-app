import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc7Component } from '../list/abc-7.component';
import { Abc7DetailComponent } from '../detail/abc-7-detail.component';
import { Abc7UpdateComponent } from '../update/abc-7-update.component';
import { Abc7RoutingResolveService } from './abc-7-routing-resolve.service';

const abc7Route: Routes = [
  {
    path: '',
    component: Abc7Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc7DetailComponent,
    resolve: {
      abc7: Abc7RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc7UpdateComponent,
    resolve: {
      abc7: Abc7RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc7UpdateComponent,
    resolve: {
      abc7: Abc7RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc7Route)],
  exports: [RouterModule],
})
export class Abc7RoutingModule {}
