import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc6 } from '../abc-6.model';
import { Abc6Service } from '../service/abc-6.service';

@Component({
  templateUrl: './abc-6-delete-dialog.component.html',
})
export class Abc6DeleteDialogComponent {
  abc6?: IAbc6;

  constructor(protected abc6Service: Abc6Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc6Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
