import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Abc15Component } from './list/abc-15.component';
import { Abc15DetailComponent } from './detail/abc-15-detail.component';
import { Abc15UpdateComponent } from './update/abc-15-update.component';
import { Abc15DeleteDialogComponent } from './delete/abc-15-delete-dialog.component';
import { Abc15RoutingModule } from './route/abc-15-routing.module';

@NgModule({
  imports: [SharedModule, Abc15RoutingModule],
  declarations: [Abc15Component, Abc15DetailComponent, Abc15UpdateComponent, Abc15DeleteDialogComponent],
  entryComponents: [Abc15DeleteDialogComponent],
})
export class Abc15Module {}
