import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc21Component } from './list/abc-21.component';
import { Abc21DetailComponent } from './detail/abc-21-detail.component';
import { Abc21UpdateComponent } from './update/abc-21-update.component';
import { Abc21DeleteDialogComponent } from './delete/abc-21-delete-dialog.component';
import { Abc21RoutingModule } from './route/abc-21-routing.module';

@NgModule({
  imports: [SharedModule, Abc21RoutingModule],
  declarations: [Abc21Component, Abc21DetailComponent, Abc21UpdateComponent, Abc21DeleteDialogComponent],
  entryComponents: [Abc21DeleteDialogComponent],
})
export class Abc21Module {}
