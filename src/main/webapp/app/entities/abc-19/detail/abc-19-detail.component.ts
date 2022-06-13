import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc19 } from '../abc-19.model';

@Component({
  selector: 'jhi-abc-19-detail',
  templateUrl: './abc-19-detail.component.html',
})
export class Abc19DetailComponent implements OnInit {
  abc19: IAbc19 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc19 }) => {
      this.abc19 = abc19;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
