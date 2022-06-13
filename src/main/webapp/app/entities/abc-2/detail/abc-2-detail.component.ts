import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc2 } from '../abc-2.model';

@Component({
  selector: 'jhi-abc-2-detail',
  templateUrl: './abc-2-detail.component.html',
})
export class Abc2DetailComponent implements OnInit {
  abc2: IAbc2 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc2 }) => {
      this.abc2 = abc2;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
