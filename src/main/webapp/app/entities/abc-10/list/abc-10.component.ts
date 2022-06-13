import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc10 } from '../abc-10.model';
import { Abc10Service } from '../service/abc-10.service';
import { Abc10DeleteDialogComponent } from '../delete/abc-10-delete-dialog.component';

@Component({
  selector: 'jhi-abc-10',
  templateUrl: './abc-10.component.html',
})
export class Abc10Component implements OnInit {
  abc10s?: IAbc10[];
  isLoading = false;

  constructor(protected abc10Service: Abc10Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc10Service.query().subscribe({
      next: (res: HttpResponse<IAbc10[]>) => {
        this.isLoading = false;
        this.abc10s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc10): number {
    return item.id!;
  }

  delete(abc10: IAbc10): void {
    const modalRef = this.modalService.open(Abc10DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc10 = abc10;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
