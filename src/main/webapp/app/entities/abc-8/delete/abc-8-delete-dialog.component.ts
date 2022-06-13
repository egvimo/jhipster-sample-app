import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc8 } from '../abc-8.model';
import { Abc8Service } from '../service/abc-8.service';

@Component({
  templateUrl: './abc-8-delete-dialog.component.html',
})
export class Abc8DeleteDialogComponent {
  abc8?: IAbc8;

  constructor(protected abc8Service: Abc8Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc8Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
