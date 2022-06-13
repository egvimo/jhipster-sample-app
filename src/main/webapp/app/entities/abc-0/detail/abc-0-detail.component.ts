import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc0 } from '../abc-0.model';

@Component({
  selector: 'jhi-abc-0-detail',
  templateUrl: './abc-0-detail.component.html',
})
export class Abc0DetailComponent implements OnInit {
  abc0: IAbc0 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc0 }) => {
      this.abc0 = abc0;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
