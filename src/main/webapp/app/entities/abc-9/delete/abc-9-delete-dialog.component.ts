import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc9 } from '../abc-9.model';
import { Abc9Service } from '../service/abc-9.service';

@Component({
  templateUrl: './abc-9-delete-dialog.component.html',
})
export class Abc9DeleteDialogComponent {
  abc9?: IAbc9;

  constructor(protected abc9Service: Abc9Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc9Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
