import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc7Component } from './list/abc-7.component';
import { Abc7DetailComponent } from './detail/abc-7-detail.component';
import { Abc7UpdateComponent } from './update/abc-7-update.component';
import { Abc7DeleteDialogComponent } from './delete/abc-7-delete-dialog.component';
import { Abc7RoutingModule } from './route/abc-7-routing.module';

@NgModule({
  imports: [SharedModule, Abc7RoutingModule],
  declarations: [Abc7Component, Abc7DetailComponent, Abc7UpdateComponent, Abc7DeleteDialogComponent],
  entryComponents: [Abc7DeleteDialogComponent],
})
export class Abc7Module {}
