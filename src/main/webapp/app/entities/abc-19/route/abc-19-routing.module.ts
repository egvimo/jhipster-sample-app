import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc19Component } from '../list/abc-19.component';
import { Abc19DetailComponent } from '../detail/abc-19-detail.component';
import { Abc19UpdateComponent } from '../update/abc-19-update.component';
import { Abc19RoutingResolveService } from './abc-19-routing-resolve.service';

const abc19Route: Routes = [
  {
    path: '',
    component: Abc19Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc19DetailComponent,
    resolve: {
      abc19: Abc19RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc19UpdateComponent,
    resolve: {
      abc19: Abc19RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc19UpdateComponent,
    resolve: {
      abc19: Abc19RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc19Route)],
  exports: [RouterModule],
})
export class Abc19RoutingModule {}
