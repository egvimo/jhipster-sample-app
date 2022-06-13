import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc27 } from '../abc-27.model';
import { Abc27Service } from '../service/abc-27.service';

@Component({
  templateUrl: './abc-27-delete-dialog.component.html',
})
export class Abc27DeleteDialogComponent {
  abc27?: IAbc27;

  constructor(protected abc27Service: Abc27Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc27Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
