import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AbcComponent } from '../list/abc.component';
import { AbcDetailComponent } from '../detail/abc-detail.component';
import { AbcUpdateComponent } from '../update/abc-update.component';
import { AbcRoutingResolveService } from './abc-routing-resolve.service';

const abcRoute: Routes = [
  {
    path: '',
    component: AbcComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AbcDetailComponent,
    resolve: {
      abc: AbcRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AbcUpdateComponent,
    resolve: {
      abc: AbcRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AbcUpdateComponent,
    resolve: {
      abc: AbcRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(abcRoute)],
  exports: [RouterModule],
})
export class AbcRoutingModule {}
