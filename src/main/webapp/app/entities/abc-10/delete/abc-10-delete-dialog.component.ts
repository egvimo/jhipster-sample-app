import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc10 } from '../abc-10.model';
import { Abc10Service } from '../service/abc-10.service';

@Component({
  templateUrl: './abc-10-delete-dialog.component.html',
})
export class Abc10DeleteDialogComponent {
  abc10?: IAbc10;

  constructor(protected abc10Service: Abc10Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc10Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
