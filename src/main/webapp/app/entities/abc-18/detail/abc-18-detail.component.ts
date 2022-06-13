import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc18 } from '../abc-18.model';

@Component({
  selector: 'jhi-abc-18-detail',
  templateUrl: './abc-18-detail.component.html',
})
export class Abc18DetailComponent implements OnInit {
  abc18: IAbc18 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc18 }) => {
      this.abc18 = abc18;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
