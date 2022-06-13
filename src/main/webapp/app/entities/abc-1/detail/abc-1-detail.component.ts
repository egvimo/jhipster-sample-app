import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc1 } from '../abc-1.model';

@Component({
  selector: 'jhi-abc-1-detail',
  templateUrl: './abc-1-detail.component.html',
})
export class Abc1DetailComponent implements OnInit {
  abc1: IAbc1 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc1 }) => {
      this.abc1 = abc1;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
