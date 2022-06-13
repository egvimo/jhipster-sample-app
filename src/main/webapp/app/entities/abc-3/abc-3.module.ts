import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc3Component } from './list/abc-3.component';
import { Abc3DetailComponent } from './detail/abc-3-detail.component';
import { Abc3UpdateComponent } from './update/abc-3-update.component';
import { Abc3DeleteDialogComponent } from './delete/abc-3-delete-dialog.component';
import { Abc3RoutingModule } from './route/abc-3-routing.module';

@NgModule({
  imports: [SharedModule, Abc3RoutingModule],
  declarations: [Abc3Component, Abc3DetailComponent, Abc3UpdateComponent, Abc3DeleteDialogComponent],
  entryComponents: [Abc3DeleteDialogComponent],
})
export class Abc3Module {}
