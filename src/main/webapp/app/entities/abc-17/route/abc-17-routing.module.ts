import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc17Component } from '../list/abc-17.component';
import { Abc17DetailComponent } from '../detail/abc-17-detail.component';
import { Abc17UpdateComponent } from '../update/abc-17-update.component';
import { Abc17RoutingResolveService } from './abc-17-routing-resolve.service';

const abc17Route: Routes = [
  {
    path: '',
    component: Abc17Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc17DetailComponent,
    resolve: {
      abc17: Abc17RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc17UpdateComponent,
    resolve: {
      abc17: Abc17RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc17UpdateComponent,
    resolve: {
      abc17: Abc17RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc17Route)],
  exports: [RouterModule],
})
export class Abc17RoutingModule {}
