import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc12 } from '../abc-12.model';
import { Abc12Service } from '../service/abc-12.service';

@Component({
  templateUrl: './abc-12-delete-dialog.component.html',
})
export class Abc12DeleteDialogComponent {
  abc12?: IAbc12;

  constructor(protected abc12Service: Abc12Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc12Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
