import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc20 } from '../abc-20.model';

@Component({
  selector: 'jhi-abc-20-detail',
  templateUrl: './abc-20-detail.component.html',
})
export class Abc20DetailComponent implements OnInit {
  abc20: IAbc20 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc20 }) => {
      this.abc20 = abc20;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
