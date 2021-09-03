import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDef } from '../def.model';

@Component({
  selector: 'jhi-def-detail',
  templateUrl: './def-detail.component.html',
})
export class DefDetailComponent implements OnInit {
  def: IDef | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ def }) => {
      this.def = def;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
