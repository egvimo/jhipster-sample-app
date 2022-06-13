import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc23 } from '../abc-23.model';
import { Abc23Service } from '../service/abc-23.service';

@Component({
  templateUrl: './abc-23-delete-dialog.component.html',
})
export class Abc23DeleteDialogComponent {
  abc23?: IAbc23;

  constructor(protected abc23Service: Abc23Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc23Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
