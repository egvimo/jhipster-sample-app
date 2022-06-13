import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc11 } from '../abc-11.model';

@Component({
  selector: 'jhi-abc-11-detail',
  templateUrl: './abc-11-detail.component.html',
})
export class Abc11DetailComponent implements OnInit {
  abc11: IAbc11 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc11 }) => {
      this.abc11 = abc11;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
