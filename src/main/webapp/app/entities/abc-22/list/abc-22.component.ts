import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc22 } from '../abc-22.model';
import { Abc22Service } from '../service/abc-22.service';
import { Abc22DeleteDialogComponent } from '../delete/abc-22-delete-dialog.component';

@Component({
  selector: 'jhi-abc-22',
  templateUrl: './abc-22.component.html',
})
export class Abc22Component implements OnInit {
  abc22s?: IAbc22[];
  isLoading = false;

  constructor(protected abc22Service: Abc22Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc22Service.query().subscribe({
      next: (res: HttpResponse<IAbc22[]>) => {
        this.isLoading = false;
        this.abc22s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc22): number {
    return item.id!;
  }

  delete(abc22: IAbc22): void {
    const modalRef = this.modalService.open(Abc22DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc22 = abc22;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
