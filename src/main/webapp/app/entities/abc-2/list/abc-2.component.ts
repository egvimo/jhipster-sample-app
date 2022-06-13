import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc2 } from '../abc-2.model';
import { Abc2Service } from '../service/abc-2.service';
import { Abc2DeleteDialogComponent } from '../delete/abc-2-delete-dialog.component';

@Component({
  selector: 'jhi-abc-2',
  templateUrl: './abc-2.component.html',
})
export class Abc2Component implements OnInit {
  abc2s?: IAbc2[];
  isLoading = false;

  constructor(protected abc2Service: Abc2Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc2Service.query().subscribe({
      next: (res: HttpResponse<IAbc2[]>) => {
        this.isLoading = false;
        this.abc2s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc2): number {
    return item.id!;
  }

  delete(abc2: IAbc2): void {
    const modalRef = this.modalService.open(Abc2DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc2 = abc2;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
