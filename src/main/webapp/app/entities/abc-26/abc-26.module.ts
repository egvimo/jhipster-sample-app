import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc26Component } from './list/abc-26.component';
import { Abc26DetailComponent } from './detail/abc-26-detail.component';
import { Abc26UpdateComponent } from './update/abc-26-update.component';
import { Abc26DeleteDialogComponent } from './delete/abc-26-delete-dialog.component';
import { Abc26RoutingModule } from './route/abc-26-routing.module';

@NgModule({
  imports: [SharedModule, Abc26RoutingModule],
  declarations: [Abc26Component, Abc26DetailComponent, Abc26UpdateComponent, Abc26DeleteDialogComponent],
  entryComponents: [Abc26DeleteDialogComponent],
})
export class Abc26Module {}
