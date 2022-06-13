import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc25 } from '../abc-25.model';
import { Abc25Service } from '../service/abc-25.service';
import { Abc25DeleteDialogComponent } from '../delete/abc-25-delete-dialog.component';

@Component({
  selector: 'jhi-abc-25',
  templateUrl: './abc-25.component.html',
})
export class Abc25Component implements OnInit {
  abc25s?: IAbc25[];
  isLoading = false;

  constructor(protected abc25Service: Abc25Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc25Service.query().subscribe({
      next: (res: HttpResponse<IAbc25[]>) => {
        this.isLoading = false;
        this.abc25s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc25): number {
    return item.id!;
  }

  delete(abc25: IAbc25): void {
    const modalRef = this.modalService.open(Abc25DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc25 = abc25;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
