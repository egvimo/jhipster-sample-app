import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc28Component } from './list/abc-28.component';
import { Abc28DetailComponent } from './detail/abc-28-detail.component';
import { Abc28UpdateComponent } from './update/abc-28-update.component';
import { Abc28DeleteDialogComponent } from './delete/abc-28-delete-dialog.component';
import { Abc28RoutingModule } from './route/abc-28-routing.module';

@NgModule({
  imports: [SharedModule, Abc28RoutingModule],
  declarations: [Abc28Component, Abc28DetailComponent, Abc28UpdateComponent, Abc28DeleteDialogComponent],
  entryComponents: [Abc28DeleteDialogComponent],
})
export class Abc28Module {}
