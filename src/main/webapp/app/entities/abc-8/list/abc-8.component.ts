import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc8 } from '../abc-8.model';
import { Abc8Service } from '../service/abc-8.service';
import { Abc8DeleteDialogComponent } from '../delete/abc-8-delete-dialog.component';

@Component({
  selector: 'jhi-abc-8',
  templateUrl: './abc-8.component.html',
})
export class Abc8Component implements OnInit {
  abc8s?: IAbc8[];
  isLoading = false;

  constructor(protected abc8Service: Abc8Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc8Service.query().subscribe({
      next: (res: HttpResponse<IAbc8[]>) => {
        this.isLoading = false;
        this.abc8s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc8): number {
    return item.id!;
  }

  delete(abc8: IAbc8): void {
    const modalRef = this.modalService.open(Abc8DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc8 = abc8;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
