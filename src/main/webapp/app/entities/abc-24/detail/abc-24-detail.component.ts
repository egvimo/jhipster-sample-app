import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc24 } from '../abc-24.model';

@Component({
  selector: 'jhi-abc-24-detail',
  templateUrl: './abc-24-detail.component.html',
})
export class Abc24DetailComponent implements OnInit {
  abc24: IAbc24 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc24 }) => {
      this.abc24 = abc24;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
