import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc20 } from '../abc-20.model';
import { Abc20Service } from '../service/abc-20.service';
import { Abc20DeleteDialogComponent } from '../delete/abc-20-delete-dialog.component';

@Component({
  selector: 'jhi-abc-20',
  templateUrl: './abc-20.component.html',
})
export class Abc20Component implements OnInit {
  abc20s?: IAbc20[];
  isLoading = false;

  constructor(protected abc20Service: Abc20Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc20Service.query().subscribe({
      next: (res: HttpResponse<IAbc20[]>) => {
        this.isLoading = false;
        this.abc20s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc20): number {
    return item.id!;
  }

  delete(abc20: IAbc20): void {
    const modalRef = this.modalService.open(Abc20DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc20 = abc20;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
