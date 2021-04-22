import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IJoinTable } from '../join-table.model';
import { JoinTableService } from '../service/join-table.service';

@Component({
  templateUrl: './join-table-delete-dialog.component.html',
})
export class JoinTableDeleteDialogComponent {
  joinTable?: IJoinTable;

  constructor(protected joinTableService: JoinTableService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.joinTableService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
