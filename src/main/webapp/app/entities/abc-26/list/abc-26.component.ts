import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc26 } from '../abc-26.model';
import { Abc26Service } from '../service/abc-26.service';
import { Abc26DeleteDialogComponent } from '../delete/abc-26-delete-dialog.component';

@Component({
  selector: 'jhi-abc-26',
  templateUrl: './abc-26.component.html',
})
export class Abc26Component implements OnInit {
  abc26s?: IAbc26[];
  isLoading = false;

  constructor(protected abc26Service: Abc26Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc26Service.query().subscribe({
      next: (res: HttpResponse<IAbc26[]>) => {
        this.isLoading = false;
        this.abc26s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc26): number {
    return item.id!;
  }

  delete(abc26: IAbc26): void {
    const modalRef = this.modalService.open(Abc26DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc26 = abc26;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
