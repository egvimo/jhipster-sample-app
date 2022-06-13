import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc0Component } from './list/abc-0.component';
import { Abc0DetailComponent } from './detail/abc-0-detail.component';
import { Abc0UpdateComponent } from './update/abc-0-update.component';
import { Abc0DeleteDialogComponent } from './delete/abc-0-delete-dialog.component';
import { Abc0RoutingModule } from './route/abc-0-routing.module';

@NgModule({
  imports: [SharedModule, Abc0RoutingModule],
  declarations: [Abc0Component, Abc0DetailComponent, Abc0UpdateComponent, Abc0DeleteDialogComponent],
  entryComponents: [Abc0DeleteDialogComponent],
})
export class Abc0Module {}
