import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc21 } from '../abc-21.model';
import { Abc21Service } from '../service/abc-21.service';

@Component({
  templateUrl: './abc-21-delete-dialog.component.html',
})
export class Abc21DeleteDialogComponent {
  abc21?: IAbc21;

  constructor(protected abc21Service: Abc21Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc21Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
