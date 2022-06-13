import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc14 } from '../abc-14.model';
import { Abc14Service } from '../service/abc-14.service';

@Component({
  templateUrl: './abc-14-delete-dialog.component.html',
})
export class Abc14DeleteDialogComponent {
  abc14?: IAbc14;

  constructor(protected abc14Service: Abc14Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc14Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
