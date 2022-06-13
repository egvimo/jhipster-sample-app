import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc2Component } from '../list/abc-2.component';
import { Abc2DetailComponent } from '../detail/abc-2-detail.component';
import { Abc2UpdateComponent } from '../update/abc-2-update.component';
import { Abc2RoutingResolveService } from './abc-2-routing-resolve.service';

const abc2Route: Routes = [
  {
    path: '',
    component: Abc2Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc2DetailComponent,
    resolve: {
      abc2: Abc2RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc2UpdateComponent,
    resolve: {
      abc2: Abc2RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc2UpdateComponent,
    resolve: {
      abc2: Abc2RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc2Route)],
  exports: [RouterModule],
})
export class Abc2RoutingModule {}
