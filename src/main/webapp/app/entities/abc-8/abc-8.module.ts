import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc8Component } from './list/abc-8.component';
import { Abc8DetailComponent } from './detail/abc-8-detail.component';
import { Abc8UpdateComponent } from './update/abc-8-update.component';
import { Abc8DeleteDialogComponent } from './delete/abc-8-delete-dialog.component';
import { Abc8RoutingModule } from './route/abc-8-routing.module';

@NgModule({
  imports: [SharedModule, Abc8RoutingModule],
  declarations: [Abc8Component, Abc8DetailComponent, Abc8UpdateComponent, Abc8DeleteDialogComponent],
  entryComponents: [Abc8DeleteDialogComponent],
})
export class Abc8Module {}
