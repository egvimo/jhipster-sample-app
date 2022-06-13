import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc11 } from '../abc-11.model';
import { Abc11Service } from '../service/abc-11.service';
import { Abc11DeleteDialogComponent } from '../delete/abc-11-delete-dialog.component';

@Component({
  selector: 'jhi-abc-11',
  templateUrl: './abc-11.component.html',
})
export class Abc11Component implements OnInit {
  abc11s?: IAbc11[];
  isLoading = false;

  constructor(protected abc11Service: Abc11Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc11Service.query().subscribe({
      next: (res: HttpResponse<IAbc11[]>) => {
        this.isLoading = false;
        this.abc11s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc11): number {
    return item.id!;
  }

  delete(abc11: IAbc11): void {
    const modalRef = this.modalService.open(Abc11DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc11 = abc11;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
