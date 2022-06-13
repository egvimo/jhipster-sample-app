import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc11Component } from './list/abc-11.component';
import { Abc11DetailComponent } from './detail/abc-11-detail.component';
import { Abc11UpdateComponent } from './update/abc-11-update.component';
import { Abc11DeleteDialogComponent } from './delete/abc-11-delete-dialog.component';
import { Abc11RoutingModule } from './route/abc-11-routing.module';

@NgModule({
  imports: [SharedModule, Abc11RoutingModule],
  declarations: [Abc11Component, Abc11DetailComponent, Abc11UpdateComponent, Abc11DeleteDialogComponent],
  entryComponents: [Abc11DeleteDialogComponent],
})
export class Abc11Module {}
