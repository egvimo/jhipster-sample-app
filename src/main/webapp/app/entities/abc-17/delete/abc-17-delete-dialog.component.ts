import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc17 } from '../abc-17.model';
import { Abc17Service } from '../service/abc-17.service';

@Component({
  templateUrl: './abc-17-delete-dialog.component.html',
})
export class Abc17DeleteDialogComponent {
  abc17?: IAbc17;

  constructor(protected abc17Service: Abc17Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc17Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
