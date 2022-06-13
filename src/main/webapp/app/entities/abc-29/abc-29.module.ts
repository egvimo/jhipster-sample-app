import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc29Component } from './list/abc-29.component';
import { Abc29DetailComponent } from './detail/abc-29-detail.component';
import { Abc29UpdateComponent } from './update/abc-29-update.component';
import { Abc29DeleteDialogComponent } from './delete/abc-29-delete-dialog.component';
import { Abc29RoutingModule } from './route/abc-29-routing.module';

@NgModule({
  imports: [SharedModule, Abc29RoutingModule],
  declarations: [Abc29Component, Abc29DetailComponent, Abc29UpdateComponent, Abc29DeleteDialogComponent],
  entryComponents: [Abc29DeleteDialogComponent],
})
export class Abc29Module {}
