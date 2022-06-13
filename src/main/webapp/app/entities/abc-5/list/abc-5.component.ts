import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc5 } from '../abc-5.model';
import { Abc5Service } from '../service/abc-5.service';
import { Abc5DeleteDialogComponent } from '../delete/abc-5-delete-dialog.component';

@Component({
  selector: 'jhi-abc-5',
  templateUrl: './abc-5.component.html',
})
export class Abc5Component implements OnInit {
  abc5s?: IAbc5[];
  isLoading = false;

  constructor(protected abc5Service: Abc5Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc5Service.query().subscribe({
      next: (res: HttpResponse<IAbc5[]>) => {
        this.isLoading = false;
        this.abc5s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc5): number {
    return item.id!;
  }

  delete(abc5: IAbc5): void {
    const modalRef = this.modalService.open(Abc5DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc5 = abc5;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
