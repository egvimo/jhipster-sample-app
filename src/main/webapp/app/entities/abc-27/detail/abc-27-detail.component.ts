import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc27 } from '../abc-27.model';

@Component({
  selector: 'jhi-abc-27-detail',
  templateUrl: './abc-27-detail.component.html',
})
export class Abc27DetailComponent implements OnInit {
  abc27: IAbc27 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc27 }) => {
      this.abc27 = abc27;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
