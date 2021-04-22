import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJoinTableAbcXyz } from '../join-table-abc-xyz.model';

@Component({
  selector: 'jhi-join-table-abc-xyz-detail',
  templateUrl: './join-table-abc-xyz-detail.component.html',
})
export class JoinTableAbcXyzDetailComponent implements OnInit {
  joinTableAbcXyz: IJoinTableAbcXyz | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ joinTableAbcXyz }) => {
      this.joinTableAbcXyz = joinTableAbcXyz;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
