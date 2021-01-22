import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAbc } from '../abc.model';
import { AbcService } from '../service/abc.service';
import { AbcDeleteDialogComponent } from '../delete/abc-delete-dialog.component';

@Component({
  selector: 'jhi-abc',
  templateUrl: './abc.component.html',
})
export class AbcComponent implements OnInit {
  abcs?: IAbc[];
  isLoading = false;

  constructor(protected abcService: AbcService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.abcService.query().subscribe(
      (res: HttpResponse<IAbc[]>) => {
        this.isLoading = false;
        this.abcs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAbc): number {
    return item.id!;
  }

  delete(abc: IAbc): void {
    const modalRef = this.modalService.open(AbcDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.abc = abc;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
