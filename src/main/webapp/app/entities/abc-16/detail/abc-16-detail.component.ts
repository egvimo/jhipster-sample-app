import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc16 } from '../abc-16.model';

@Component({
  selector: 'jhi-abc-16-detail',
  templateUrl: './abc-16-detail.component.html',
})
export class Abc16DetailComponent implements OnInit {
  abc16: IAbc16 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc16 }) => {
      this.abc16 = abc16;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
