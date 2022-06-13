import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc10Component } from './list/abc-10.component';
import { Abc10DetailComponent } from './detail/abc-10-detail.component';
import { Abc10UpdateComponent } from './update/abc-10-update.component';
import { Abc10DeleteDialogComponent } from './delete/abc-10-delete-dialog.component';
import { Abc10RoutingModule } from './route/abc-10-routing.module';

@NgModule({
  imports: [SharedModule, Abc10RoutingModule],
  declarations: [Abc10Component, Abc10DetailComponent, Abc10UpdateComponent, Abc10DeleteDialogComponent],
  entryComponents: [Abc10DeleteDialogComponent],
})
export class Abc10Module {}
