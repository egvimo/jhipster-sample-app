import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc6Component } from '../list/abc-6.component';
import { Abc6DetailComponent } from '../detail/abc-6-detail.component';
import { Abc6UpdateComponent } from '../update/abc-6-update.component';
import { Abc6RoutingResolveService } from './abc-6-routing-resolve.service';

const abc6Route: Routes = [
  {
    path: '',
    component: Abc6Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc6DetailComponent,
    resolve: {
      abc6: Abc6RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc6UpdateComponent,
    resolve: {
      abc6: Abc6RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc6UpdateComponent,
    resolve: {
      abc6: Abc6RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc6Route)],
  exports: [RouterModule],
})
export class Abc6RoutingModule {}
