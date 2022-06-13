import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc18 } from '../abc-18.model';
import { Abc18Service } from '../service/abc-18.service';

@Component({
  templateUrl: './abc-18-delete-dialog.component.html',
})
export class Abc18DeleteDialogComponent {
  abc18?: IAbc18;

  constructor(protected abc18Service: Abc18Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc18Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
