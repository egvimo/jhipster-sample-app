import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc23 } from '../abc-23.model';

@Component({
  selector: 'jhi-abc-23-detail',
  templateUrl: './abc-23-detail.component.html',
})
export class Abc23DetailComponent implements OnInit {
  abc23: IAbc23 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc23 }) => {
      this.abc23 = abc23;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
