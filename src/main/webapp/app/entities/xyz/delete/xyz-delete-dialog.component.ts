import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IXyz } from '../xyz.model';
import { XyzService } from '../service/xyz.service';

@Component({
  templateUrl: './xyz-delete-dialog.component.html',
})
export class XyzDeleteDialogComponent {
  xyz?: IXyz;

  constructor(protected xyzService: XyzService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.xyzService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
