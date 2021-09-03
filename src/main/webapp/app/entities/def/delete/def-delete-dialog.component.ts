import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDef } from '../def.model';
import { DefService } from '../service/def.service';

@Component({
  templateUrl: './def-delete-dialog.component.html',
})
export class DefDeleteDialogComponent {
  def?: IDef;

  constructor(protected defService: DefService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.defService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
