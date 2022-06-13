import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc10Component } from '../list/abc-10.component';
import { Abc10DetailComponent } from '../detail/abc-10-detail.component';
import { Abc10UpdateComponent } from '../update/abc-10-update.component';
import { Abc10RoutingResolveService } from './abc-10-routing-resolve.service';

const abc10Route: Routes = [
  {
    path: '',
    component: Abc10Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc10DetailComponent,
    resolve: {
      abc10: Abc10RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc10UpdateComponent,
    resolve: {
      abc10: Abc10RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc10UpdateComponent,
    resolve: {
      abc10: Abc10RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc10Route)],
  exports: [RouterModule],
})
export class Abc10RoutingModule {}
