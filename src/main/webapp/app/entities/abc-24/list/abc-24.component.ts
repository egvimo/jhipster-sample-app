import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc24 } from '../abc-24.model';
import { Abc24Service } from '../service/abc-24.service';
import { Abc24DeleteDialogComponent } from '../delete/abc-24-delete-dialog.component';

@Component({
  selector: 'jhi-abc-24',
  templateUrl: './abc-24.component.html',
})
export class Abc24Component implements OnInit {
  abc24s?: IAbc24[];
  isLoading = false;

  constructor(protected abc24Service: Abc24Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc24Service.query().subscribe({
      next: (res: HttpResponse<IAbc24[]>) => {
        this.isLoading = false;
        this.abc24s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc24): number {
    return item.id!;
  }

  delete(abc24: IAbc24): void {
    const modalRef = this.modalService.open(Abc24DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc24 = abc24;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
