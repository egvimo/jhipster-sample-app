import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc13 } from '../abc-13.model';
import { Abc13Service } from '../service/abc-13.service';
import { Abc13DeleteDialogComponent } from '../delete/abc-13-delete-dialog.component';

@Component({
  selector: 'jhi-abc-13',
  templateUrl: './abc-13.component.html',
})
export class Abc13Component implements OnInit {
  abc13s?: IAbc13[];
  isLoading = false;

  constructor(protected abc13Service: Abc13Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc13Service.query().subscribe({
      next: (res: HttpResponse<IAbc13[]>) => {
        this.isLoading = false;
        this.abc13s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc13): number {
    return item.id!;
  }

  delete(abc13: IAbc13): void {
    const modalRef = this.modalService.open(Abc13DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc13 = abc13;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
