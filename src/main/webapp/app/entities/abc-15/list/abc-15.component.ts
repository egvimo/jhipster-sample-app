import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc15 } from '../abc-15.model';
import { Abc15Service } from '../service/abc-15.service';
import { Abc15DeleteDialogComponent } from '../delete/abc-15-delete-dialog.component';

@Component({
  selector: 'jhi-abc-15',
  templateUrl: './abc-15.component.html',
})
export class Abc15Component implements OnInit {
  abc15s?: IAbc15[];
  isLoading = false;

  constructor(protected abc15Service: Abc15Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc15Service.query().subscribe({
      next: (res: HttpResponse<IAbc15[]>) => {
        this.isLoading = false;
        this.abc15s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc15): number {
    return item.id!;
  }

  delete(abc15: IAbc15): void {
    const modalRef = this.modalService.open(Abc15DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc15 = abc15;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
