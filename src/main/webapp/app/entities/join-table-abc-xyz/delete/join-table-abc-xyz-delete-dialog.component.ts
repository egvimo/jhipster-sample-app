import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IJoinTableAbcXyz } from '../join-table-abc-xyz.model';
import { JoinTableAbcXyzService } from '../service/join-table-abc-xyz.service';

@Component({
  templateUrl: './join-table-abc-xyz-delete-dialog.component.html',
})
export class JoinTableAbcXyzDeleteDialogComponent {
  joinTableAbcXyz?: IJoinTableAbcXyz;

  constructor(protected joinTableAbcXyzService: JoinTableAbcXyzService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.joinTableAbcXyzService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
