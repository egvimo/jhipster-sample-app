import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc21 } from '../abc-21.model';

@Component({
  selector: 'jhi-abc-21-detail',
  templateUrl: './abc-21-detail.component.html',
})
export class Abc21DetailComponent implements OnInit {
  abc21: IAbc21 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc21 }) => {
      this.abc21 = abc21;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
