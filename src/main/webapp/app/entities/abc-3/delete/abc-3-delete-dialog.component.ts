import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc3 } from '../abc-3.model';
import { Abc3Service } from '../service/abc-3.service';

@Component({
  templateUrl: './abc-3-delete-dialog.component.html',
})
export class Abc3DeleteDialogComponent {
  abc3?: IAbc3;

  constructor(protected abc3Service: Abc3Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc3Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
