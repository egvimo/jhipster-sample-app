import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc16Component } from './list/abc-16.component';
import { Abc16DetailComponent } from './detail/abc-16-detail.component';
import { Abc16UpdateComponent } from './update/abc-16-update.component';
import { Abc16DeleteDialogComponent } from './delete/abc-16-delete-dialog.component';
import { Abc16RoutingModule } from './route/abc-16-routing.module';

@NgModule({
  imports: [SharedModule, Abc16RoutingModule],
  declarations: [Abc16Component, Abc16DetailComponent, Abc16UpdateComponent, Abc16DeleteDialogComponent],
  entryComponents: [Abc16DeleteDialogComponent],
})
export class Abc16Module {}
