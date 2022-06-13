import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc26 } from '../abc-26.model';
import { Abc26Service } from '../service/abc-26.service';

@Component({
  templateUrl: './abc-26-delete-dialog.component.html',
})
export class Abc26DeleteDialogComponent {
  abc26?: IAbc26;

  constructor(protected abc26Service: Abc26Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc26Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
