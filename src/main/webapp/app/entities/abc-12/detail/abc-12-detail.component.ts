import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc12 } from '../abc-12.model';

@Component({
  selector: 'jhi-abc-12-detail',
  templateUrl: './abc-12-detail.component.html',
})
export class Abc12DetailComponent implements OnInit {
  abc12: IAbc12 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc12 }) => {
      this.abc12 = abc12;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
