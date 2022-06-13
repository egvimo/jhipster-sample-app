import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc14 } from '../abc-14.model';
import { Abc14Service } from '../service/abc-14.service';
import { Abc14DeleteDialogComponent } from '../delete/abc-14-delete-dialog.component';

@Component({
  selector: 'jhi-abc-14',
  templateUrl: './abc-14.component.html',
})
export class Abc14Component implements OnInit {
  abc14s?: IAbc14[];
  isLoading = false;

  constructor(protected abc14Service: Abc14Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc14Service.query().subscribe({
      next: (res: HttpResponse<IAbc14[]>) => {
        this.isLoading = false;
        this.abc14s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc14): number {
    return item.id!;
  }

  delete(abc14: IAbc14): void {
    const modalRef = this.modalService.open(Abc14DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc14 = abc14;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
