import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc16 } from '../abc-16.model';
import { Abc16Service } from '../service/abc-16.service';
import { Abc16DeleteDialogComponent } from '../delete/abc-16-delete-dialog.component';

@Component({
  selector: 'jhi-abc-16',
  templateUrl: './abc-16.component.html',
})
export class Abc16Component implements OnInit {
  abc16s?: IAbc16[];
  isLoading = false;

  constructor(protected abc16Service: Abc16Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc16Service.query().subscribe({
      next: (res: HttpResponse<IAbc16[]>) => {
        this.isLoading = false;
        this.abc16s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc16): number {
    return item.id!;
  }

  delete(abc16: IAbc16): void {
    const modalRef = this.modalService.open(Abc16DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc16 = abc16;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
