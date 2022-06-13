import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc16 } from '../abc-16.model';
import { Abc16Service } from '../service/abc-16.service';

@Component({
  templateUrl: './abc-16-delete-dialog.component.html',
})
export class Abc16DeleteDialogComponent {
  abc16?: IAbc16;

  constructor(protected abc16Service: Abc16Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc16Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
