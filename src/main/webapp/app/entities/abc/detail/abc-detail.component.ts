import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAbc } from '../abc.model';

@Component({
  selector: 'jhi-abc-detail',
  templateUrl: './abc-detail.component.html',
})
export class AbcDetailComponent implements OnInit {
  abc: IAbc | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc }) => {
      this.abc = abc;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
