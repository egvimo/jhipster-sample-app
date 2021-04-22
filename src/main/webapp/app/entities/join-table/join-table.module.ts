import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { JoinTableComponent } from './list/join-table.component';
import { JoinTableDetailComponent } from './detail/join-table-detail.component';
import { JoinTableUpdateComponent } from './update/join-table-update.component';
import { JoinTableDeleteDialogComponent } from './delete/join-table-delete-dialog.component';
import { JoinTableRoutingModule } from './route/join-table-routing.module';

@NgModule({
  imports: [SharedModule, JoinTableRoutingModule],
  declarations: [JoinTableComponent, JoinTableDetailComponent, JoinTableUpdateComponent, JoinTableDeleteDialogComponent],
  entryComponents: [JoinTableDeleteDialogComponent],
})
export class JoinTableModule {}
