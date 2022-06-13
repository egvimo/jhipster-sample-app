import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc29Component } from '../list/abc-29.component';
import { Abc29DetailComponent } from '../detail/abc-29-detail.component';
import { Abc29UpdateComponent } from '../update/abc-29-update.component';
import { Abc29RoutingResolveService } from './abc-29-routing-resolve.service';

const abc29Route: Routes = [
  {
    path: '',
    component: Abc29Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc29DetailComponent,
    resolve: {
      abc29: Abc29RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc29UpdateComponent,
    resolve: {
      abc29: Abc29RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc29UpdateComponent,
    resolve: {
      abc29: Abc29RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc29Route)],
  exports: [RouterModule],
})
export class Abc29RoutingModule {}
