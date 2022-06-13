import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc22Component } from '../list/abc-22.component';
import { Abc22DetailComponent } from '../detail/abc-22-detail.component';
import { Abc22UpdateComponent } from '../update/abc-22-update.component';
import { Abc22RoutingResolveService } from './abc-22-routing-resolve.service';

const abc22Route: Routes = [
  {
    path: '',
    component: Abc22Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc22DetailComponent,
    resolve: {
      abc22: Abc22RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc22UpdateComponent,
    resolve: {
      abc22: Abc22RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc22UpdateComponent,
    resolve: {
      abc22: Abc22RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc22Route)],
  exports: [RouterModule],
})
export class Abc22RoutingModule {}
