import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc1 } from '../abc-1.model';
import { Abc1Service } from '../service/abc-1.service';

@Component({
  templateUrl: './abc-1-delete-dialog.component.html',
})
export class Abc1DeleteDialogComponent {
  abc1?: IAbc1;

  constructor(protected abc1Service: Abc1Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc1Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
