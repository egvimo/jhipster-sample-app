import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc5 } from '../abc-5.model';

@Component({
  selector: 'jhi-abc-5-detail',
  templateUrl: './abc-5-detail.component.html',
})
export class Abc5DetailComponent implements OnInit {
  abc5: IAbc5 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc5 }) => {
      this.abc5 = abc5;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
