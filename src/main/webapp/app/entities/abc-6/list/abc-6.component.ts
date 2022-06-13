import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc6 } from '../abc-6.model';
import { Abc6Service } from '../service/abc-6.service';
import { Abc6DeleteDialogComponent } from '../delete/abc-6-delete-dialog.component';

@Component({
  selector: 'jhi-abc-6',
  templateUrl: './abc-6.component.html',
})
export class Abc6Component implements OnInit {
  abc6s?: IAbc6[];
  isLoading = false;

  constructor(protected abc6Service: Abc6Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc6Service.query().subscribe({
      next: (res: HttpResponse<IAbc6[]>) => {
        this.isLoading = false;
        this.abc6s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc6): number {
    return item.id!;
  }

  delete(abc6: IAbc6): void {
    const modalRef = this.modalService.open(Abc6DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc6 = abc6;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
