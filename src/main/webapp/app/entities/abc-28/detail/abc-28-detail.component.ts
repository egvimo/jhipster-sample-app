import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc28 } from '../abc-28.model';

@Component({
  selector: 'jhi-abc-28-detail',
  templateUrl: './abc-28-detail.component.html',
})
export class Abc28DetailComponent implements OnInit {
  abc28: IAbc28 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc28 }) => {
      this.abc28 = abc28;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
