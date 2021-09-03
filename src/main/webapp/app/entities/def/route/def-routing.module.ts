import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DefComponent } from '../list/def.component';
import { DefDetailComponent } from '../detail/def-detail.component';
import { DefUpdateComponent } from '../update/def-update.component';
import { DefRoutingResolveService } from './def-routing-resolve.service';

const defRoute: Routes = [
  {
    path: '',
    component: DefComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DefDetailComponent,
    resolve: {
      def: DefRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DefUpdateComponent,
    resolve: {
      def: DefRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DefUpdateComponent,
    resolve: {
      def: DefRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(defRoute)],
  exports: [RouterModule],
})
export class DefRoutingModule {}
