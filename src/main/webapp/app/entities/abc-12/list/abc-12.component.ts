import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc12 } from '../abc-12.model';
import { Abc12Service } from '../service/abc-12.service';
import { Abc12DeleteDialogComponent } from '../delete/abc-12-delete-dialog.component';

@Component({
  selector: 'jhi-abc-12',
  templateUrl: './abc-12.component.html',
})
export class Abc12Component implements OnInit {
  abc12s?: IAbc12[];
  isLoading = false;

  constructor(protected abc12Service: Abc12Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc12Service.query().subscribe({
      next: (res: HttpResponse<IAbc12[]>) => {
        this.isLoading = false;
        this.abc12s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc12): number {
    return item.id!;
  }

  delete(abc12: IAbc12): void {
    const modalRef = this.modalService.open(Abc12DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc12 = abc12;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
