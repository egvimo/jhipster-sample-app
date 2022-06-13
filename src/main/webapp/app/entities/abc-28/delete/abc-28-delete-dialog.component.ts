import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc28 } from '../abc-28.model';
import { Abc28Service } from '../service/abc-28.service';

@Component({
  templateUrl: './abc-28-delete-dialog.component.html',
})
export class Abc28DeleteDialogComponent {
  abc28?: IAbc28;

  constructor(protected abc28Service: Abc28Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc28Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
