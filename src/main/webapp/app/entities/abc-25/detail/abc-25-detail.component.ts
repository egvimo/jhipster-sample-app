import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc25 } from '../abc-25.model';

@Component({
  selector: 'jhi-abc-25-detail',
  templateUrl: './abc-25-detail.component.html',
})
export class Abc25DetailComponent implements OnInit {
  abc25: IAbc25 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc25 }) => {
      this.abc25 = abc25;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
