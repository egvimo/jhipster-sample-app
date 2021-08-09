import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { XyzComponent } from './list/xyz.component';
import { XyzDetailComponent } from './detail/xyz-detail.component';
import { XyzUpdateComponent } from './update/xyz-update.component';
import { XyzDeleteDialogComponent } from './delete/xyz-delete-dialog.component';
import { XyzRoutingModule } from './route/xyz-routing.module';

@NgModule({
  imports: [SharedModule, XyzRoutingModule],
  declarations: [XyzComponent, XyzDetailComponent, XyzUpdateComponent, XyzDeleteDialogComponent],
  entryComponents: [XyzDeleteDialogComponent],
})
export class XyzModule {}
