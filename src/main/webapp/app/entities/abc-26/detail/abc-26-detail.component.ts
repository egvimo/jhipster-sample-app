import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc26 } from '../abc-26.model';

@Component({
  selector: 'jhi-abc-26-detail',
  templateUrl: './abc-26-detail.component.html',
})
export class Abc26DetailComponent implements OnInit {
  abc26: IAbc26 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc26 }) => {
      this.abc26 = abc26;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
