import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { AbcComponent } from './list/abc.component';
import { AbcDetailComponent } from './detail/abc-detail.component';
import { AbcUpdateComponent } from './update/abc-update.component';
import { AbcDeleteDialogComponent } from './delete/abc-delete-dialog.component';
import { AbcRoutingModule } from './route/abc-routing.module';

@NgModule({
  imports: [SharedModule, AbcRoutingModule],
  declarations: [AbcComponent, AbcDetailComponent, AbcUpdateComponent, AbcDeleteDialogComponent],
  entryComponents: [AbcDeleteDialogComponent],
})
export class AbcModule {}
