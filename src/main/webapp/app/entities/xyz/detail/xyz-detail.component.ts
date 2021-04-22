import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IXyz } from '../xyz.model';

@Component({
  selector: 'jhi-xyz-detail',
  templateUrl: './xyz-detail.component.html',
})
export class XyzDetailComponent implements OnInit {
  xyz: IXyz | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ xyz }) => {
      this.xyz = xyz;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
