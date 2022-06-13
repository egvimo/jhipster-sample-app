import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc19 } from '../abc-19.model';
import { Abc19Service } from '../service/abc-19.service';
import { Abc19DeleteDialogComponent } from '../delete/abc-19-delete-dialog.component';

@Component({
  selector: 'jhi-abc-19',
  templateUrl: './abc-19.component.html',
})
export class Abc19Component implements OnInit {
  abc19s?: IAbc19[];
  isLoading = false;

  constructor(protected abc19Service: Abc19Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abc19Service.query().subscribe({
      next: (res: HttpResponse<IAbc19[]>) => {
        this.isLoading = false;
        this.abc19s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAbc19): number {
    return item.id!;
  }

  delete(abc19: IAbc19): void {
    const modalRef = this.modalService.open(Abc19DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc19 = abc19;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
