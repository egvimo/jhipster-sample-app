import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Abc11Component } from '../list/abc-11.component';
import { Abc11DetailComponent } from '../detail/abc-11-detail.component';
import { Abc11UpdateComponent } from '../update/abc-11-update.component';
import { Abc11RoutingResolveService } from './abc-11-routing-resolve.service';

const abc11Route: Routes = [
  {
    path: '',
    component: Abc11Component,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Abc11DetailComponent,
    resolve: {
      abc11: Abc11RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Abc11UpdateComponent,
    resolve: {
      abc11: Abc11RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Abc11UpdateComponent,
    resolve: {
      abc11: Abc11RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abc11Route)],
  exports: [RouterModule],
})
export class Abc11RoutingModule {}
