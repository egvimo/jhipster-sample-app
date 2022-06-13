import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc13Component } from './list/abc-13.component';
import { Abc13DetailComponent } from './detail/abc-13-detail.component';
import { Abc13UpdateComponent } from './update/abc-13-update.component';
import { Abc13DeleteDialogComponent } from './delete/abc-13-delete-dialog.component';
import { Abc13RoutingModule } from './route/abc-13-routing.module';

@NgModule({
  imports: [SharedModule, Abc13RoutingModule],
  declarations: [Abc13Component, Abc13DetailComponent, Abc13UpdateComponent, Abc13DeleteDialogComponent],
  entryComponents: [Abc13DeleteDialogComponent],
})
export class Abc13Module {}
