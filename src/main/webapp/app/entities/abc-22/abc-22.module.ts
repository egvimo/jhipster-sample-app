import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc22Component } from './list/abc-22.component';
import { Abc22DetailComponent } from './detail/abc-22-detail.component';
import { Abc22UpdateComponent } from './update/abc-22-update.component';
import { Abc22DeleteDialogComponent } from './delete/abc-22-delete-dialog.component';
import { Abc22RoutingModule } from './route/abc-22-routing.module';

@NgModule({
  imports: [SharedModule, Abc22RoutingModule],
  declarations: [Abc22Component, Abc22DetailComponent, Abc22UpdateComponent, Abc22DeleteDialogComponent],
  entryComponents: [Abc22DeleteDialogComponent],
})
export class Abc22Module {}
