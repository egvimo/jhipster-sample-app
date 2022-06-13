import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc2Component } from './list/abc-2.component';
import { Abc2DetailComponent } from './detail/abc-2-detail.component';
import { Abc2UpdateComponent } from './update/abc-2-update.component';
import { Abc2DeleteDialogComponent } from './delete/abc-2-delete-dialog.component';
import { Abc2RoutingModule } from './route/abc-2-routing.module';

@NgModule({
  imports: [SharedModule, Abc2RoutingModule],
  declarations: [Abc2Component, Abc2DetailComponent, Abc2UpdateComponent, Abc2DeleteDialogComponent],
  entryComponents: [Abc2DeleteDialogComponent],
})
export class Abc2Module {}
