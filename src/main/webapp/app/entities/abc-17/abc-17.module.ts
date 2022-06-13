import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc17Component } from './list/abc-17.component';
import { Abc17DetailComponent } from './detail/abc-17-detail.component';
import { Abc17UpdateComponent } from './update/abc-17-update.component';
import { Abc17DeleteDialogComponent } from './delete/abc-17-delete-dialog.component';
import { Abc17RoutingModule } from './route/abc-17-routing.module';

@NgModule({
  imports: [SharedModule, Abc17RoutingModule],
  declarations: [Abc17Component, Abc17DetailComponent, Abc17UpdateComponent, Abc17DeleteDialogComponent],
  entryComponents: [Abc17DeleteDialogComponent],
})
export class Abc17Module {}
