import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc21Component } from '../list/abc-21.component';
import { Abc21DetailComponent } from '../detail/abc-21-detail.component';
import { Abc21UpdateComponent } from '../update/abc-21-update.component';
import { Abc21RoutingResolveService } from './abc-21-routing-resolve.service';

const abc21Route: Routes = [
  {
    path: '',
    component: Abc21Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc21DetailComponent,
    resolve: {
      abc21: Abc21RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc21UpdateComponent,
    resolve: {
      abc21: Abc21RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc21UpdateComponent,
    resolve: {
      abc21: Abc21RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc21Route)],
  exports: [RouterModule],
})
export class Abc21RoutingModule {}
