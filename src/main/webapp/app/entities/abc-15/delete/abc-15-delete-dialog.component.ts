import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc15 } from '../abc-15.model';
import { Abc15Service } from '../service/abc-15.service';

@Component({
  templateUrl: './abc-15-delete-dialog.component.html',
})
export class Abc15DeleteDialogComponent {
  abc15?: IAbc15;

  constructor(protected abc15Service: Abc15Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc15Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
