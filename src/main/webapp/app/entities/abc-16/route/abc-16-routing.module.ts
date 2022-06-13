import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc16Component } from '../list/abc-16.component';
import { Abc16DetailComponent } from '../detail/abc-16-detail.component';
import { Abc16UpdateComponent } from '../update/abc-16-update.component';
import { Abc16RoutingResolveService } from './abc-16-routing-resolve.service';

const abc16Route: Routes = [
  {
    path: '',
    component: Abc16Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc16DetailComponent,
    resolve: {
      abc16: Abc16RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc16UpdateComponent,
    resolve: {
      abc16: Abc16RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc16UpdateComponent,
    resolve: {
      abc16: Abc16RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc16Route)],
  exports: [RouterModule],
})
export class Abc16RoutingModule {}
