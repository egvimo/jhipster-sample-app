import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc17 } from '../abc-17.model';
import { Abc17Service } from '../service/abc-17.service';
import { Abc17DeleteDialogComponent } from '../delete/abc-17-delete-dialog.component';

@Component({
  selector: 'jhi-abc-17',
  templateUrl: './abc-17.component.html',
})
export class Abc17Component implements OnInit {
  abc17s?: IAbc17[];
  isLoading = false;

  constructor(protected abc17Service: Abc17Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc17Service.query().subscribe({
      next: (res: HttpResponse<IAbc17[]>) => {
        this.isLoading = false;
        this.abc17s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc17): number {
    return item.id!;
  }

  delete(abc17: IAbc17): void {
    const modalRef = this.modalService.open(Abc17DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc17 = abc17;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
