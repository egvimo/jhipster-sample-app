import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc6 } from '../abc-6.model';

@Component({
  selector: 'jhi-abc-6-detail',
  templateUrl: './abc-6-detail.component.html',
})
export class Abc6DetailComponent implements OnInit {
  abc6: IAbc6 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc6 }) => {
      this.abc6 = abc6;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
