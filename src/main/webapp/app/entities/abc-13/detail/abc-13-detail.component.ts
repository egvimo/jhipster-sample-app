import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc13 } from '../abc-13.model';

@Component({
  selector: 'jhi-abc-13-detail',
  templateUrl: './abc-13-detail.component.html',
})
export class Abc13DetailComponent implements OnInit {
  abc13: IAbc13 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc13 }) => {
      this.abc13 = abc13;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
