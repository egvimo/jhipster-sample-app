import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc18 } from '../abc-18.model';
import { Abc18Service } from '../service/abc-18.service';
import { Abc18DeleteDialogComponent } from '../delete/abc-18-delete-dialog.component';

@Component({
  selector: 'jhi-abc-18',
  templateUrl: './abc-18.component.html',
})
export class Abc18Component implements OnInit {
  abc18s?: IAbc18[];
  isLoading = false;

  constructor(protected abc18Service: Abc18Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc18Service.query().subscribe({
      next: (res: HttpResponse<IAbc18[]>) => {
        this.isLoading = false;
        this.abc18s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc18): number {
    return item.id!;
  }

  delete(abc18: IAbc18): void {
    const modalRef = this.modalService.open(Abc18DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc18 = abc18;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
