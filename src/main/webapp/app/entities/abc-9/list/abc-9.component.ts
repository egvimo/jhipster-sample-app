import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc9 } from '../abc-9.model';
import { Abc9Service } from '../service/abc-9.service';
import { Abc9DeleteDialogComponent } from '../delete/abc-9-delete-dialog.component';

@Component({
  selector: 'jhi-abc-9',
  templateUrl: './abc-9.component.html',
})
export class Abc9Component implements OnInit {
  abc9s?: IAbc9[];
  isLoading = false;

  constructor(protected abc9Service: Abc9Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc9Service.query().subscribe({
      next: (res: HttpResponse<IAbc9[]>) => {
        this.isLoading = false;
        this.abc9s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc9): number {
    return item.id!;
  }

  delete(abc9: IAbc9): void {
    const modalRef = this.modalService.open(Abc9DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc9 = abc9;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
