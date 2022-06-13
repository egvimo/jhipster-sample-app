import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc1 } from '../abc-1.model';
import { Abc1Service } from '../service/abc-1.service';
import { Abc1DeleteDialogComponent } from '../delete/abc-1-delete-dialog.component';

@Component({
  selector: 'jhi-abc-1',
  templateUrl: './abc-1.component.html',
})
export class Abc1Component implements OnInit {
  abc1s?: IAbc1[];
  isLoading = false;

  constructor(protected abc1Service: Abc1Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc1Service.query().subscribe({
      next: (res: HttpResponse<IAbc1[]>) => {
        this.isLoading = false;
        this.abc1s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc1): number {
    return item.id!;
  }

  delete(abc1: IAbc1): void {
    const modalRef = this.modalService.open(Abc1DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc1 = abc1;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
