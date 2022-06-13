import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc27Component } from '../list/abc-27.component';
import { Abc27DetailComponent } from '../detail/abc-27-detail.component';
import { Abc27UpdateComponent } from '../update/abc-27-update.component';
import { Abc27RoutingResolveService } from './abc-27-routing-resolve.service';

const abc27Route: Routes = [
  {
    path: '',
    component: Abc27Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc27DetailComponent,
    resolve: {
      abc27: Abc27RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc27UpdateComponent,
    resolve: {
      abc27: Abc27RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc27UpdateComponent,
    resolve: {
      abc27: Abc27RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc27Route)],
  exports: [RouterModule],
})
export class Abc27RoutingModule {}
