import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc9Component } from './list/abc-9.component';
import { Abc9DetailComponent } from './detail/abc-9-detail.component';
import { Abc9UpdateComponent } from './update/abc-9-update.component';
import { Abc9DeleteDialogComponent } from './delete/abc-9-delete-dialog.component';
import { Abc9RoutingModule } from './route/abc-9-routing.module';

@NgModule({
  imports: [SharedModule, Abc9RoutingModule],
  declarations: [Abc9Component, Abc9DetailComponent, Abc9UpdateComponent, Abc9DeleteDialogComponent],
  entryComponents: [Abc9DeleteDialogComponent],
})
export class Abc9Module {}
