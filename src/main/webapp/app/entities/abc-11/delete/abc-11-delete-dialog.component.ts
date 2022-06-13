import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc11 } from '../abc-11.model';
import { Abc11Service } from '../service/abc-11.service';

@Component({
  templateUrl: './abc-11-delete-dialog.component.html',
})
export class Abc11DeleteDialogComponent {
  abc11?: IAbc11;

  constructor(protected abc11Service: Abc11Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc11Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
