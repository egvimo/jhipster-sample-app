import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { JoinTableComponent } from '../list/join-table.component';
import { JoinTableDetailComponent } from '../detail/join-table-detail.component';
import { JoinTableUpdateComponent } from '../update/join-table-update.component';
import { JoinTableRoutingResolveService } from './join-table-routing-resolve.service';

const joinTableRoute: Routes = [
  {
    path: '',
    component: JoinTableComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: JoinTableDetailComponent,
    resolve: {
      joinTable: JoinTableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: JoinTableUpdateComponent,
    resolve: {
      joinTable: JoinTableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: JoinTableUpdateComponent,
    resolve: {
      joinTable: JoinTableRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(joinTableRoute)],
  exports: [RouterModule],
})
export class JoinTableRoutingModule {}
