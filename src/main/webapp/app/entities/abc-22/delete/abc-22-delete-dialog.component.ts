import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc22 } from '../abc-22.model';
import { Abc22Service } from '../service/abc-22.service';

@Component({
  templateUrl: './abc-22-delete-dialog.component.html',
})
export class Abc22DeleteDialogComponent {
  abc22?: IAbc22;

  constructor(protected abc22Service: Abc22Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc22Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
