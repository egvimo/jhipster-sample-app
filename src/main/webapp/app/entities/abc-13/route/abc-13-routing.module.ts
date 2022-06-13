import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc13Component } from '../list/abc-13.component';
import { Abc13DetailComponent } from '../detail/abc-13-detail.component';
import { Abc13UpdateComponent } from '../update/abc-13-update.component';
import { Abc13RoutingResolveService } from './abc-13-routing-resolve.service';

const abc13Route: Routes = [
  {
    path: '',
    component: Abc13Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc13DetailComponent,
    resolve: {
      abc13: Abc13RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc13UpdateComponent,
    resolve: {
      abc13: Abc13RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc13UpdateComponent,
    resolve: {
      abc13: Abc13RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc13Route)],
  exports: [RouterModule],
})
export class Abc13RoutingModule {}
