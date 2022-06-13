import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc17 } from '../abc-17.model';

@Component({
  selector: 'jhi-abc-17-detail',
  templateUrl: './abc-17-detail.component.html',
})
export class Abc17DetailComponent implements OnInit {
  abc17: IAbc17 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc17 }) => {
      this.abc17 = abc17;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
