import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc25Component } from './list/abc-25.component';
import { Abc25DetailComponent } from './detail/abc-25-detail.component';
import { Abc25UpdateComponent } from './update/abc-25-update.component';
import { Abc25DeleteDialogComponent } from './delete/abc-25-delete-dialog.component';
import { Abc25RoutingModule } from './route/abc-25-routing.module';

@NgModule({
  imports: [SharedModule, Abc25RoutingModule],
  declarations: [Abc25Component, Abc25DetailComponent, Abc25UpdateComponent, Abc25DeleteDialogComponent],
  entryComponents: [Abc25DeleteDialogComponent],
})
export class Abc25Module {}
