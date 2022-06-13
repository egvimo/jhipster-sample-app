import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc5 } from '../abc-5.model';
import { Abc5Service } from '../service/abc-5.service';

@Component({
  templateUrl: './abc-5-delete-dialog.component.html',
})
export class Abc5DeleteDialogComponent {
  abc5?: IAbc5;

  constructor(protected abc5Service: Abc5Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc5Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
