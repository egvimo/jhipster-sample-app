import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc0 } from '../abc-0.model';
import { Abc0Service } from '../service/abc-0.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './abc-0-delete-dialog.component.html',
})
export class Abc0DeleteDialogComponent {
  abc0?: IAbc0;

  constructor(protected abc0Service: Abc0Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abc0Service.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
