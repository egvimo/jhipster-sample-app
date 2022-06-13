import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc7 } from '../abc-7.model';
import { Abc7Service } from '../service/abc-7.service';
import { Abc7DeleteDialogComponent } from '../delete/abc-7-delete-dialog.component';

@Component({
  selector: 'jhi-abc-7',
  templateUrl: './abc-7.component.html',
})
export class Abc7Component implements OnInit {
  abc7s?: IAbc7[];
  isLoading = false;

  constructor(protected abc7Service: Abc7Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc7Service.query().subscribe({
      next: (res: HttpResponse<IAbc7[]>) => {
        this.isLoading = false;
        this.abc7s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc7): number {
    return item.id!;
  }

  delete(abc7: IAbc7): void {
    const modalRef = this.modalService.open(Abc7DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc7 = abc7;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
