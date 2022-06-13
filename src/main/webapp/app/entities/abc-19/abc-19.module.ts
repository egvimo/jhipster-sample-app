import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc19Component } from './list/abc-19.component';
import { Abc19DetailComponent } from './detail/abc-19-detail.component';
import { Abc19UpdateComponent } from './update/abc-19-update.component';
import { Abc19DeleteDialogComponent } from './delete/abc-19-delete-dialog.component';
import { Abc19RoutingModule } from './route/abc-19-routing.module';

@NgModule({
  imports: [SharedModule, Abc19RoutingModule],
  declarations: [Abc19Component, Abc19DetailComponent, Abc19UpdateComponent, Abc19DeleteDialogComponent],
  entryComponents: [Abc19DeleteDialogComponent],
})
export class Abc19Module {}
