import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc20Component } from './list/abc-20.component';
import { Abc20DetailComponent } from './detail/abc-20-detail.component';
import { Abc20UpdateComponent } from './update/abc-20-update.component';
import { Abc20DeleteDialogComponent } from './delete/abc-20-delete-dialog.component';
import { Abc20RoutingModule } from './route/abc-20-routing.module';

@NgModule({
  imports: [SharedModule, Abc20RoutingModule],
  declarations: [Abc20Component, Abc20DetailComponent, Abc20UpdateComponent, Abc20DeleteDialogComponent],
  entryComponents: [Abc20DeleteDialogComponent],
})
export class Abc20Module {}
