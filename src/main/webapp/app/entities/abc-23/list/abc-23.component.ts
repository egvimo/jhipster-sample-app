import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc23 } from '../abc-23.model';
import { Abc23Service } from '../service/abc-23.service';
import { Abc23DeleteDialogComponent } from '../delete/abc-23-delete-dialog.component';

@Component({
  selector: 'jhi-abc-23',
  templateUrl: './abc-23.component.html',
})
export class Abc23Component implements OnInit {
  abc23s?: IAbc23[];
  isLoading = false;

  constructor(protected abc23Service: Abc23Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc23Service.query().subscribe({
      next: (res: HttpResponse<IAbc23[]>) => {
        this.isLoading = false;
        this.abc23s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc23): number {
    return item.id!;
  }

  delete(abc23: IAbc23): void {
    const modalRef = this.modalService.open(Abc23DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc23 = abc23;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
