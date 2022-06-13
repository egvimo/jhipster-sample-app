import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc10 } from '../abc-10.model';

@Component({
  selector: 'jhi-abc-10-detail',
  templateUrl: './abc-10-detail.component.html',
})
export class Abc10DetailComponent implements OnInit {
  abc10: IAbc10 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc10 }) => {
      this.abc10 = abc10;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
