import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc12Component } from './list/abc-12.component';
import { Abc12DetailComponent } from './detail/abc-12-detail.component';
import { Abc12UpdateComponent } from './update/abc-12-update.component';
import { Abc12DeleteDialogComponent } from './delete/abc-12-delete-dialog.component';
import { Abc12RoutingModule } from './route/abc-12-routing.module';

@NgModule({
  imports: [SharedModule, Abc12RoutingModule],
  declarations: [Abc12Component, Abc12DetailComponent, Abc12UpdateComponent, Abc12DeleteDialogComponent],
  entryComponents: [Abc12DeleteDialogComponent],
})
export class Abc12Module {}
