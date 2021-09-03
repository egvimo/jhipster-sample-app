import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDef } from '../def.model';
import { DefService } from '../service/def.service';
import { DefDeleteDialogComponent } from '../delete/def-delete-dialog.component';

@Component({
  selector: 'jhi-def',
  templateUrl: './def.component.html',
})
export class DefComponent implements OnInit {
  defs?: IDef[];
  isLoading = false;

  constructor(protected defService: DefService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.defService.query().subscribe(
      (res: HttpResponse<IDef[]>) => {
        this.isLoading = false;
        this.defs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IDef): number {
    return item.id!;
  }

  delete(def: IDef): void {
    const modalRef = this.modalService.open(DefDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.def = def;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
