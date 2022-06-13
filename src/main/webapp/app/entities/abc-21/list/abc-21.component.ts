import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc21 } from '../abc-21.model';
import { Abc21Service } from '../service/abc-21.service';
import { Abc21DeleteDialogComponent } from '../delete/abc-21-delete-dialog.component';

@Component({
  selector: 'jhi-abc-21',
  templateUrl: './abc-21.component.html',
})
export class Abc21Component implements OnInit {
  abc21s?: IAbc21[];
  isLoading = false;

  constructor(protected abc21Service: Abc21Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc21Service.query().subscribe({
      next: (res: HttpResponse<IAbc21[]>) => {
        this.isLoading = false;
        this.abc21s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc21): number {
    return item.id!;
  }

  delete(abc21: IAbc21): void {
    const modalRef = this.modalService.open(Abc21DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc21 = abc21;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
