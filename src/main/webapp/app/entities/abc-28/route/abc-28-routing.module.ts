import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc28Component } from '../list/abc-28.component';
import { Abc28DetailComponent } from '../detail/abc-28-detail.component';
import { Abc28UpdateComponent } from '../update/abc-28-update.component';
import { Abc28RoutingResolveService } from './abc-28-routing-resolve.service';

const abc28Route: Routes = [
  {
    path: '',
    component: Abc28Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc28DetailComponent,
    resolve: {
      abc28: Abc28RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc28UpdateComponent,
    resolve: {
      abc28: Abc28RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc28UpdateComponent,
    resolve: {
      abc28: Abc28RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc28Route)],
  exports: [RouterModule],
})
export class Abc28RoutingModule {}
