import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IJoinTable } from '../join-table.model';
import { JoinTableService } from '../service/join-table.service';
import { JoinTableDeleteDialogComponent } from '../delete/join-table-delete-dialog.component';

@Component({
  selector: 'jhi-join-table',
  templateUrl: './join-table.component.html',
})
export class JoinTableComponent implements OnInit {
  joinTables?: IJoinTable[];
  isLoading = false;

  constructor(protected joinTableService: JoinTableService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.joinTableService.query().subscribe(
      (res: HttpResponse<IJoinTable[]>) => {
        this.isLoading = false;
        this.joinTables = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IJoinTable): number {
    return item.id!;
  }

  delete(joinTable: IJoinTable): void {
    const modalRef = this.modalService.open(JoinTableDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.joinTable = joinTable;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
