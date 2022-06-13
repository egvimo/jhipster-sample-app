import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc13 } from '../abc-13.model';
import { Abc13Service } from '../service/abc-13.service';

@Component({
  templateUrl: './abc-13-delete-dialog.component.html',
})
export class Abc13DeleteDialogComponent {
  abc13?: IAbc13;

  constructor(protected abc13Service: Abc13Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc13Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
