import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc23Component } from './list/abc-23.component';
import { Abc23DetailComponent } from './detail/abc-23-detail.component';
import { Abc23UpdateComponent } from './update/abc-23-update.component';
import { Abc23DeleteDialogComponent } from './delete/abc-23-delete-dialog.component';
import { Abc23RoutingModule } from './route/abc-23-routing.module';

@NgModule({
  imports: [SharedModule, Abc23RoutingModule],
  declarations: [Abc23Component, Abc23DetailComponent, Abc23UpdateComponent, Abc23DeleteDialogComponent],
  entryComponents: [Abc23DeleteDialogComponent],
})
export class Abc23Module {}
