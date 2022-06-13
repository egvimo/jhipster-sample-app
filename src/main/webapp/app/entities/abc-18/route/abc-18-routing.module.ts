import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc18Component } from '../list/abc-18.component';
import { Abc18DetailComponent } from '../detail/abc-18-detail.component';
import { Abc18UpdateComponent } from '../update/abc-18-update.component';
import { Abc18RoutingResolveService } from './abc-18-routing-resolve.service';

const abc18Route: Routes = [
  {
    path: '',
    component: Abc18Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc18DetailComponent,
    resolve: {
      abc18: Abc18RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc18UpdateComponent,
    resolve: {
      abc18: Abc18RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc18UpdateComponent,
    resolve: {
      abc18: Abc18RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc18Route)],
  exports: [RouterModule],
})
export class Abc18RoutingModule {}
