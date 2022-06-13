import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc4 } from '../abc-4.model';

@Component({
  selector: 'jhi-abc-4-detail',
  templateUrl: './abc-4-detail.component.html',
})
export class Abc4DetailComponent implements OnInit {
  abc4: IAbc4 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc4 }) => {
      this.abc4 = abc4;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
