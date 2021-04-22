import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { XyzComponent } from '../list/xyz.component';
import { XyzDetailComponent } from '../detail/xyz-detail.component';
import { XyzUpdateComponent } from '../update/xyz-update.component';
import { XyzRoutingResolveService } from './xyz-routing-resolve.service';

const xyzRoute: Routes = [
  {
    path: '',
    component: XyzComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: XyzDetailComponent,
    resolve: {
      xyz: XyzRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: XyzUpdateComponent,
    resolve: {
      xyz: XyzRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: XyzUpdateComponent,
    resolve: {
      xyz: XyzRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(xyzRoute)],
  exports: [RouterModule],
})
export class XyzRoutingModule {}
