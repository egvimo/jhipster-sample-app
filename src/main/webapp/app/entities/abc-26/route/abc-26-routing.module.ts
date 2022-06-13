import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc26Component } from '../list/abc-26.component';
import { Abc26DetailComponent } from '../detail/abc-26-detail.component';
import { Abc26UpdateComponent } from '../update/abc-26-update.component';
import { Abc26RoutingResolveService } from './abc-26-routing-resolve.service';

const abc26Route: Routes = [
  {
    path: '',
    component: Abc26Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc26DetailComponent,
    resolve: {
      abc26: Abc26RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc26UpdateComponent,
    resolve: {
      abc26: Abc26RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc26UpdateComponent,
    resolve: {
      abc26: Abc26RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc26Route)],
  exports: [RouterModule],
})
export class Abc26RoutingModule {}
