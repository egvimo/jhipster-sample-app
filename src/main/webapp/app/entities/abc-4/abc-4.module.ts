import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc4Component } from './list/abc-4.component';
import { Abc4DetailComponent } from './detail/abc-4-detail.component';
import { Abc4UpdateComponent } from './update/abc-4-update.component';
import { Abc4DeleteDialogComponent } from './delete/abc-4-delete-dialog.component';
import { Abc4RoutingModule } from './route/abc-4-routing.module';

@NgModule({
  imports: [SharedModule, Abc4RoutingModule],
  declarations: [Abc4Component, Abc4DetailComponent, Abc4UpdateComponent, Abc4DeleteDialogComponent],
  entryComponents: [Abc4DeleteDialogComponent],
})
export class Abc4Module {}
