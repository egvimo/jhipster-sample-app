import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc14Component } from './list/abc-14.component';
import { Abc14DetailComponent } from './detail/abc-14-detail.component';
import { Abc14UpdateComponent } from './update/abc-14-update.component';
import { Abc14DeleteDialogComponent } from './delete/abc-14-delete-dialog.component';
import { Abc14RoutingModule } from './route/abc-14-routing.module';

@NgModule({
  imports: [SharedModule, Abc14RoutingModule],
  declarations: [Abc14Component, Abc14DetailComponent, Abc14UpdateComponent, Abc14DeleteDialogComponent],
  entryComponents: [Abc14DeleteDialogComponent],
})
export class Abc14Module {}
