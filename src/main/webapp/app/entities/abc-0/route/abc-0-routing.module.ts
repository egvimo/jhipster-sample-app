import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc0Component } from '../list/abc-0.component';
import { Abc0DetailComponent } from '../detail/abc-0-detail.component';
import { Abc0UpdateComponent } from '../update/abc-0-update.component';
import { Abc0RoutingResolveService } from './abc-0-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const abc0Route: Routes = [
  {
    path: '',
    component: Abc0Component,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc0DetailComponent,
    resolve: {
      abc0: Abc0RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc0UpdateComponent,
    resolve: {
      abc0: Abc0RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc0UpdateComponent,
    resolve: {
      abc0: Abc0RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc0Route)],
  exports: [RouterModule],
})
export class Abc0RoutingModule {}
