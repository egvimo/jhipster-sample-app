import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc29 } from '../abc-29.model';

@Component({
  selector: 'jhi-abc-29-detail',
  templateUrl: './abc-29-detail.component.html',
})
export class Abc29DetailComponent implements OnInit {
  abc29: IAbc29 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc29 }) => {
      this.abc29 = abc29;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
