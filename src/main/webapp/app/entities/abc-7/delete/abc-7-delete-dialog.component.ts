import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc7 } from '../abc-7.model';
import { Abc7Service } from '../service/abc-7.service';

@Component({
  templateUrl: './abc-7-delete-dialog.component.html',
})
export class Abc7DeleteDialogComponent {
  abc7?: IAbc7;

  constructor(protected abc7Service: Abc7Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc7Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
