import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc3 } from '../abc-3.model';

@Component({
  selector: 'jhi-abc-3-detail',
  templateUrl: './abc-3-detail.component.html',
})
export class Abc3DetailComponent implements OnInit {
  abc3: IAbc3 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc3 }) => {
      this.abc3 = abc3;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
