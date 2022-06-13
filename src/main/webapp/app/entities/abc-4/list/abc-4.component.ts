import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc4 } from '../abc-4.model';
import { Abc4Service } from '../service/abc-4.service';
import { Abc4DeleteDialogComponent } from '../delete/abc-4-delete-dialog.component';

@Component({
  selector: 'jhi-abc-4',
  templateUrl: './abc-4.component.html',
})
export class Abc4Component implements OnInit {
  abc4s?: IAbc4[];
  isLoading = false;

  constructor(protected abc4Service: Abc4Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc4Service.query().subscribe({
      next: (res: HttpResponse<IAbc4[]>) => {
        this.isLoading = false;
        this.abc4s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc4): number {
    return item.id!;
  }

  delete(abc4: IAbc4): void {
    const modalRef = this.modalService.open(Abc4DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc4 = abc4;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
