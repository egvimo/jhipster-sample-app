import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc5Component } from './list/abc-5.component';
import { Abc5DetailComponent } from './detail/abc-5-detail.component';
import { Abc5UpdateComponent } from './update/abc-5-update.component';
import { Abc5DeleteDialogComponent } from './delete/abc-5-delete-dialog.component';
import { Abc5RoutingModule } from './route/abc-5-routing.module';

@NgModule({
  imports: [SharedModule, Abc5RoutingModule],
  declarations: [Abc5Component, Abc5DetailComponent, Abc5UpdateComponent, Abc5DeleteDialogComponent],
  entryComponents: [Abc5DeleteDialogComponent],
})
export class Abc5Module {}
