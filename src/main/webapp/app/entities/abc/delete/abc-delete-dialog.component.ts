import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc } from '../abc.model';
import { AbcService } from '../service/abc.service';

@Component({
  templateUrl: './abc-delete-dialog.component.html',
})
export class AbcDeleteDialogComponent {
  abc?: IAbc;

  constructor(protected abcService: AbcService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abcService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
