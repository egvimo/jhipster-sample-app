import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc20 } from '../abc-20.model';
import { Abc20Service } from '../service/abc-20.service';

@Component({
  templateUrl: './abc-20-delete-dialog.component.html',
})
export class Abc20DeleteDialogComponent {
  abc20?: IAbc20;

  constructor(protected abc20Service: Abc20Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc20Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
