import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc4 } from '../abc-4.model';
import { Abc4Service } from '../service/abc-4.service';

@Component({
  templateUrl: './abc-4-delete-dialog.component.html',
})
export class Abc4DeleteDialogComponent {
  abc4?: IAbc4;

  constructor(protected abc4Service: Abc4Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc4Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
