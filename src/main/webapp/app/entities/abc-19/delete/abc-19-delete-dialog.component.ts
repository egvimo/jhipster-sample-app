import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc19 } from '../abc-19.model';
import { Abc19Service } from '../service/abc-19.service';

@Component({
  templateUrl: './abc-19-delete-dialog.component.html',
})
export class Abc19DeleteDialogComponent {
  abc19?: IAbc19;

  constructor(protected abc19Service: Abc19Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc19Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
