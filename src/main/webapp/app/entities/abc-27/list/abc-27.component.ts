import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc27 } from '../abc-27.model';
import { Abc27Service } from '../service/abc-27.service';
import { Abc27DeleteDialogComponent } from '../delete/abc-27-delete-dialog.component';

@Component({
  selector: 'jhi-abc-27',
  templateUrl: './abc-27.component.html',
})
export class Abc27Component implements OnInit {
  abc27s?: IAbc27[];
  isLoading = false;

  constructor(protected abc27Service: Abc27Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc27Service.query().subscribe({
      next: (res: HttpResponse<IAbc27[]>) => {
        this.isLoading = false;
        this.abc27s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc27): number {
    return item.id!;
  }

  delete(abc27: IAbc27): void {
    const modalRef = this.modalService.open(Abc27DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc27 = abc27;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
