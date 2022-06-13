import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc15 } from '../abc-15.model';

@Component({
  selector: 'jhi-abc-15-detail',
  templateUrl: './abc-15-detail.component.html',
})
export class Abc15DetailComponent implements OnInit {
  abc15: IAbc15 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc15 }) => {
      this.abc15 = abc15;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
