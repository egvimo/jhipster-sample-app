import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc15Component } from '../list/abc-15.component';
import { Abc15DetailComponent } from '../detail/abc-15-detail.component';
import { Abc15UpdateComponent } from '../update/abc-15-update.component';
import { Abc15RoutingResolveService } from './abc-15-routing-resolve.service';

const abc15Route: Routes = [
  {
    path: '',
    component: Abc15Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc15DetailComponent,
    resolve: {
      abc15: Abc15RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc15UpdateComponent,
    resolve: {
      abc15: Abc15RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc15UpdateComponent,
    resolve: {
      abc15: Abc15RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc15Route)],
  exports: [RouterModule],
})
export class Abc15RoutingModule {}
