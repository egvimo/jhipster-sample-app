import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DefComponent } from './list/def.component';
import { DefDetailComponent } from './detail/def-detail.component';
import { DefUpdateComponent } from './update/def-update.component';
import { DefDeleteDialogComponent } from './delete/def-delete-dialog.component';
import { DefRoutingModule } from './route/def-routing.module';

@NgModule({
  imports: [SharedModule, DefRoutingModule],
  declarations: [DefComponent, DefDetailComponent, DefUpdateComponent, DefDeleteDialogComponent],
  entryComponents: [DefDeleteDialogComponent],
})
export class DefModule {}
