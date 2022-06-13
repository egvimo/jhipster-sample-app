import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc1Component } from './list/abc-1.component';
import { Abc1DetailComponent } from './detail/abc-1-detail.component';
import { Abc1UpdateComponent } from './update/abc-1-update.component';
import { Abc1DeleteDialogComponent } from './delete/abc-1-delete-dialog.component';
import { Abc1RoutingModule } from './route/abc-1-routing.module';

@NgModule({
  imports: [SharedModule, Abc1RoutingModule],
  declarations: [Abc1Component, Abc1DetailComponent, Abc1UpdateComponent, Abc1DeleteDialogComponent],
  entryComponents: [Abc1DeleteDialogComponent],
})
export class Abc1Module {}
