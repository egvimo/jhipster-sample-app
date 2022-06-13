import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IXyz } from '../xyz.model';
import { XyzService } from '../service/xyz.service';
import { XyzDeleteDialogComponent } from '../delete/xyz-delete-dialog.component';

@Component({
  selector: 'jhi-xyz',
  templateUrl: './xyz.component.html',
})
export class XyzComponent implements OnInit {
  xyzs?: IXyz[];
  isLoading = false;

  constructor(protected xyzService: XyzService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.xyzService.query().subscribe({
      next: (res: HttpResponse<IXyz[]>) => {
        this.isLoading = false;
        this.xyzs = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IXyz): number {
    return item.id!;
  }

  delete(xyz: IXyz): void {
    const modalRef = this.modalService.open(XyzDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.xyz = xyz;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
