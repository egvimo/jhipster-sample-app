import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc25 } from '../abc-25.model';
import { Abc25Service } from '../service/abc-25.service';

@Component({
  templateUrl: './abc-25-delete-dialog.component.html',
})
export class Abc25DeleteDialogComponent {
  abc25?: IAbc25;

  constructor(protected abc25Service: Abc25Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc25Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
