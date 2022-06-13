import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc0 } from '../abc-0.model';
import { Abc0Service } from '../service/abc-0.service';
import { Abc0DeleteDialogComponent } from '../delete/abc-0-delete-dialog.component';

@Component({
  selector: 'jhi-abc-0',
  templateUrl: './abc-0.component.html',
})
export class Abc0Component implements OnInit {
  abc0s?: IAbc0[];
  isLoading = false;

  constructor(protected abc0Service: Abc0Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc0Service.query().subscribe({
      next: (res: HttpResponse<IAbc0[]>) => {
        this.isLoading = false;
        this.abc0s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc0): number {
    return item.id!;
  }

  delete(abc0: IAbc0): void {
    const modalRef = this.modalService.open(Abc0DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc0 = abc0;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
