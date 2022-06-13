import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc20Component } from '../list/abc-20.component';
import { Abc20DetailComponent } from '../detail/abc-20-detail.component';
import { Abc20UpdateComponent } from '../update/abc-20-update.component';
import { Abc20RoutingResolveService } from './abc-20-routing-resolve.service';

const abc20Route: Routes = [
  {
    path: '',
    component: Abc20Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc20DetailComponent,
    resolve: {
      abc20: Abc20RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc20UpdateComponent,
    resolve: {
      abc20: Abc20RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc20UpdateComponent,
    resolve: {
      abc20: Abc20RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc20Route)],
  exports: [RouterModule],
})
export class Abc20RoutingModule {}
