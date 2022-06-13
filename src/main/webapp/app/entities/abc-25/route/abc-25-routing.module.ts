import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc25Component } from '../list/abc-25.component';
import { Abc25DetailComponent } from '../detail/abc-25-detail.component';
import { Abc25UpdateComponent } from '../update/abc-25-update.component';
import { Abc25RoutingResolveService } from './abc-25-routing-resolve.service';

const abc25Route: Routes = [
  {
    path: '',
    component: Abc25Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc25DetailComponent,
    resolve: {
      abc25: Abc25RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc25UpdateComponent,
    resolve: {
      abc25: Abc25RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc25UpdateComponent,
    resolve: {
      abc25: Abc25RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc25Route)],
  exports: [RouterModule],
})
export class Abc25RoutingModule {}
