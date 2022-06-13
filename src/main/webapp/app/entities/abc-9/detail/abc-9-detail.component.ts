import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc9 } from '../abc-9.model';

@Component({
  selector: 'jhi-abc-9-detail',
  templateUrl: './abc-9-detail.component.html',
})
export class Abc9DetailComponent implements OnInit {
  abc9: IAbc9 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc9 }) => {
      this.abc9 = abc9;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
