import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc22 } from '../abc-22.model';

@Component({
  selector: 'jhi-abc-22-detail',
  templateUrl: './abc-22-detail.component.html',
})
export class Abc22DetailComponent implements OnInit {
  abc22: IAbc22 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc22 }) => {
      this.abc22 = abc22;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
