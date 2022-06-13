import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc2 } from '../abc-2.model';
import { Abc2Service } from '../service/abc-2.service';

@Component({
  templateUrl: './abc-2-delete-dialog.component.html',
})
export class Abc2DeleteDialogComponent {
  abc2?: IAbc2;

  constructor(protected abc2Service: Abc2Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc2Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
