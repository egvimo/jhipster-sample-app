import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc7 } from '../abc-7.model';

@Component({
  selector: 'jhi-abc-7-detail',
  templateUrl: './abc-7-detail.component.html',
})
export class Abc7DetailComponent implements OnInit {
  abc7: IAbc7 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc7 }) => {
      this.abc7 = abc7;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
