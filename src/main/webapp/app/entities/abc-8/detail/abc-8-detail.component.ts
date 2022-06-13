import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc8 } from '../abc-8.model';

@Component({
  selector: 'jhi-abc-8-detail',
  templateUrl: './abc-8-detail.component.html',
})
export class Abc8DetailComponent implements OnInit {
  abc8: IAbc8 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc8 }) => {
      this.abc8 = abc8;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
