import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc9Component } from '../list/abc-9.component';
import { Abc9DetailComponent } from '../detail/abc-9-detail.component';
import { Abc9UpdateComponent } from '../update/abc-9-update.component';
import { Abc9RoutingResolveService } from './abc-9-routing-resolve.service';

const abc9Route: Routes = [
  {
    path: '',
    component: Abc9Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc9DetailComponent,
    resolve: {
      abc9: Abc9RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc9UpdateComponent,
    resolve: {
      abc9: Abc9RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc9UpdateComponent,
    resolve: {
      abc9: Abc9RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc9Route)],
  exports: [RouterModule],
})
export class Abc9RoutingModule {}
