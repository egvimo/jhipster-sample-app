import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { JoinTableAbcXyzComponent } from '../list/join-table-abc-xyz.component';
import { JoinTableAbcXyzDetailComponent } from '../detail/join-table-abc-xyz-detail.component';
import { JoinTableAbcXyzUpdateComponent } from '../update/join-table-abc-xyz-update.component';
import { JoinTableAbcXyzRoutingResolveService } from './join-table-abc-xyz-routing-resolve.service';

const joinTableAbcXyzRoute: Routes = [
  {
    path: '',
    component: JoinTableAbcXyzComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: JoinTableAbcXyzDetailComponent,
    resolve: {
      joinTableAbcXyz: JoinTableAbcXyzRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: JoinTableAbcXyzUpdateComponent,
    resolve: {
      joinTableAbcXyz: JoinTableAbcXyzRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: JoinTableAbcXyzUpdateComponent,
    resolve: {
      joinTableAbcXyz: JoinTableAbcXyzRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(joinTableAbcXyzRoute)],
  exports: [RouterModule],
})
export class JoinTableAbcXyzRoutingModule {}
