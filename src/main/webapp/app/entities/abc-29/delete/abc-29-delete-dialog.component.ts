import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc29 } from '../abc-29.model';
import { Abc29Service } from '../service/abc-29.service';

@Component({
  templateUrl: './abc-29-delete-dialog.component.html',
})
export class Abc29DeleteDialogComponent {
  abc29?: IAbc29;

  constructor(protected abc29Service: Abc29Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc29Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
