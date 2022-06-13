import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc5Component } from '../list/abc-5.component';
import { Abc5DetailComponent } from '../detail/abc-5-detail.component';
import { Abc5UpdateComponent } from '../update/abc-5-update.component';
import { Abc5RoutingResolveService } from './abc-5-routing-resolve.service';

const abc5Route: Routes = [
  {
    path: '',
    component: Abc5Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc5DetailComponent,
    resolve: {
      abc5: Abc5RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc5UpdateComponent,
    resolve: {
      abc5: Abc5RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc5UpdateComponent,
    resolve: {
      abc5: Abc5RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc5Route)],
  exports: [RouterModule],
})
export class Abc5RoutingModule {}
