import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc6Component } from './list/abc-6.component';
import { Abc6DetailComponent } from './detail/abc-6-detail.component';
import { Abc6UpdateComponent } from './update/abc-6-update.component';
import { Abc6DeleteDialogComponent } from './delete/abc-6-delete-dialog.component';
import { Abc6RoutingModule } from './route/abc-6-routing.module';

@NgModule({
  imports: [SharedModule, Abc6RoutingModule],
  declarations: [Abc6Component, Abc6DetailComponent, Abc6UpdateComponent, Abc6DeleteDialogComponent],
  entryComponents: [Abc6DeleteDialogComponent],
})
export class Abc6Module {}
