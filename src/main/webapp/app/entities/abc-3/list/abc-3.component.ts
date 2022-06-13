import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc3 } from '../abc-3.model';
import { Abc3Service } from '../service/abc-3.service';
import { Abc3DeleteDialogComponent } from '../delete/abc-3-delete-dialog.component';

@Component({
  selector: 'jhi-abc-3',
  templateUrl: './abc-3.component.html',
})
export class Abc3Component implements OnInit {
  abc3s?: IAbc3[];
  isLoading = false;

  constructor(protected abc3Service: Abc3Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc3Service.query().subscribe({
      next: (res: HttpResponse<IAbc3[]>) => {
        this.isLoading = false;
        this.abc3s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc3): number {
    return item.id!;
  }

  delete(abc3: IAbc3): void {
    const modalRef = this.modalService.open(Abc3DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc3 = abc3;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
