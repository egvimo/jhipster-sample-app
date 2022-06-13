import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc24Component } from './list/abc-24.component';
import { Abc24DetailComponent } from './detail/abc-24-detail.component';
import { Abc24UpdateComponent } from './update/abc-24-update.component';
import { Abc24DeleteDialogComponent } from './delete/abc-24-delete-dialog.component';
import { Abc24RoutingModule } from './route/abc-24-routing.module';

@NgModule({
  imports: [SharedModule, Abc24RoutingModule],
  declarations: [Abc24Component, Abc24DetailComponent, Abc24UpdateComponent, Abc24DeleteDialogComponent],
  entryComponents: [Abc24DeleteDialogComponent],
})
export class Abc24Module {}
