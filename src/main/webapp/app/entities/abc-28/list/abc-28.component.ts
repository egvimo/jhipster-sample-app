import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc28 } from '../abc-28.model';
import { Abc28Service } from '../service/abc-28.service';
import { Abc28DeleteDialogComponent } from '../delete/abc-28-delete-dialog.component';

@Component({
  selector: 'jhi-abc-28',
  templateUrl: './abc-28.component.html',
})
export class Abc28Component implements OnInit {
  abc28s?: IAbc28[];
  isLoading = false;

  constructor(protected abc28Service: Abc28Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc28Service.query().subscribe({
      next: (res: HttpResponse<IAbc28[]>) => {
        this.isLoading = false;
        this.abc28s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc28): number {
    return item.id!;
  }

  delete(abc28: IAbc28): void {
    const modalRef = this.modalService.open(Abc28DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc28 = abc28;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
