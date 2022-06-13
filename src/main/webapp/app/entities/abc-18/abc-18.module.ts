import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc18Component } from './list/abc-18.component';
import { Abc18DetailComponent } from './detail/abc-18-detail.component';
import { Abc18UpdateComponent } from './update/abc-18-update.component';
import { Abc18DeleteDialogComponent } from './delete/abc-18-delete-dialog.component';
import { Abc18RoutingModule } from './route/abc-18-routing.module';

@NgModule({
  imports: [SharedModule, Abc18RoutingModule],
  declarations: [Abc18Component, Abc18DetailComponent, Abc18UpdateComponent, Abc18DeleteDialogComponent],
  entryComponents: [Abc18DeleteDialogComponent],
})
export class Abc18Module {}
