import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc4Component } from '../list/abc-4.component';
import { Abc4DetailComponent } from '../detail/abc-4-detail.component';
import { Abc4UpdateComponent } from '../update/abc-4-update.component';
import { Abc4RoutingResolveService } from './abc-4-routing-resolve.service';

const abc4Route: Routes = [
  {
    path: '',
    component: Abc4Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc4DetailComponent,
    resolve: {
      abc4: Abc4RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc4UpdateComponent,
    resolve: {
      abc4: Abc4RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc4UpdateComponent,
    resolve: {
      abc4: Abc4RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc4Route)],
  exports: [RouterModule],
})
export class Abc4RoutingModule {}
