import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc27Component } from './list/abc-27.component';
import { Abc27DetailComponent } from './detail/abc-27-detail.component';
import { Abc27UpdateComponent } from './update/abc-27-update.component';
import { Abc27DeleteDialogComponent } from './delete/abc-27-delete-dialog.component';
import { Abc27RoutingModule } from './route/abc-27-routing.module';

@NgModule({
  imports: [SharedModule, Abc27RoutingModule],
  declarations: [Abc27Component, Abc27DetailComponent, Abc27UpdateComponent, Abc27DeleteDialogComponent],
  entryComponents: [Abc27DeleteDialogComponent],
})
export class Abc27Module {}
