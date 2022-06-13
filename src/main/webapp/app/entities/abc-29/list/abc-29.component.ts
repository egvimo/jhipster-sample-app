import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc29 } from '../abc-29.model';
import { Abc29Service } from '../service/abc-29.service';
import { Abc29DeleteDialogComponent } from '../delete/abc-29-delete-dialog.component';

@Component({
  selector: 'jhi-abc-29',
  templateUrl: './abc-29.component.html',
})
export class Abc29Component implements OnInit {
  abc29s?: IAbc29[];
  isLoading = false;

  constructor(protected abc29Service: Abc29Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc29Service.query().subscribe({
      next: (res: HttpResponse<IAbc29[]>) => {
        this.isLoading = false;
        this.abc29s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc29): number {
    return item.id!;
  }

  delete(abc29: IAbc29): void {
    const modalRef = this.modalService.open(Abc29DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc29 = abc29;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
