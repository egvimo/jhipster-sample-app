import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc14 } from '../abc-14.model';

@Component({
  selector: 'jhi-abc-14-detail',
  templateUrl: './abc-14-detail.component.html',
})
export class Abc14DetailComponent implements OnInit {
  abc14: IAbc14 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc14 }) => {
      this.abc14 = abc14;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
