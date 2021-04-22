import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { JoinTableAbcXyzComponent } from './list/join-table-abc-xyz.component';
import { JoinTableAbcXyzDetailComponent } from './detail/join-table-abc-xyz-detail.component';
import { JoinTableAbcXyzUpdateComponent } from './update/join-table-abc-xyz-update.component';
import { JoinTableAbcXyzDeleteDialogComponent } from './delete/join-table-abc-xyz-delete-dialog.component';
import { JoinTableAbcXyzRoutingModule } from './route/join-table-abc-xyz-routing.module';

@NgModule({
  imports: [SharedModule, JoinTableAbcXyzRoutingModule],
  declarations: [
    JoinTableAbcXyzComponent,
    JoinTableAbcXyzDetailComponent,
    JoinTableAbcXyzUpdateComponent,
    JoinTableAbcXyzDeleteDialogComponent,
  ],
  entryComponents: [JoinTableAbcXyzDeleteDialogComponent],
})
export class JoinTableAbcXyzModule {}
