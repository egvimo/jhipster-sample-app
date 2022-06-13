import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc24 } from '../abc-24.model';
import { Abc24Service } from '../service/abc-24.service';

@Component({
  templateUrl: './abc-24-delete-dialog.component.html',
})
export class Abc24DeleteDialogComponent {
  abc24?: IAbc24;

  constructor(protected abc24Service: Abc24Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc24Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
