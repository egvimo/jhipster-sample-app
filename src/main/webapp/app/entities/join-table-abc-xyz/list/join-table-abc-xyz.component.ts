import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IJoinTableAbcXyz } from '../join-table-abc-xyz.model';
import { JoinTableAbcXyzService } from '../service/join-table-abc-xyz.service';
import { JoinTableAbcXyzDeleteDialogComponent } from '../delete/join-table-abc-xyz-delete-dialog.component';

@Component({
  selector: 'jhi-join-table-abc-xyz',
  templateUrl: './join-table-abc-xyz.component.html',
})
export class JoinTableAbcXyzComponent implements OnInit {
  joinTableAbcXyzs?: IJoinTableAbcXyz[];
  isLoading = false;

  constructor(protected joinTableAbcXyzService: JoinTableAbcXyzService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.joinTableAbcXyzService.query().subscribe(
      (res: HttpResponse<IJoinTableAbcXyz[]>) => {
        this.isLoading = false;
        this.joinTableAbcXyzs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IJoinTableAbcXyz): number {
    return item.id!;
  }

  delete(joinTableAbcXyz: IJoinTableAbcXyz): void {
    const modalRef = this.modalService.open(JoinTableAbcXyzDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.joinTableAbcXyz = joinTableAbcXyz;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
