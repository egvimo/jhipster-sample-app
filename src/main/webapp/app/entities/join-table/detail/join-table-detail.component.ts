import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJoinTable } from '../join-table.model';

@Component({
  selector: 'jhi-join-table-detail',
  templateUrl: './join-table-detail.component.html',
})
export class JoinTableDetailComponent implements OnInit {
  joinTable: IJoinTable | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ joinTable }) => {
      this.joinTable = joinTable;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
