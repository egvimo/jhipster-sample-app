import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Abc0FormService, Abc0FormGroup } from './abc-0-form.service';
import { IAbc0 } from '../abc-0.model';
import { Abc0Service } from '../service/abc-0.service';

@Component({
  selector: 'jhi-abc-0-update',
  templateUrl: './abc-0-update.component.html',
})
export class Abc0UpdateComponent implements OnInit {
  isSaving = false;
  abc0: IAbc0 | null = null;

  editForm: Abc0FormGroup = this.abc0FormService.createAbc0FormGroup();

  constructor(protected abc0Service: Abc0Service, protected abc0FormService: Abc0FormService, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc0 }) => {
      this.abc0 = abc0;
      if (abc0) {
        this.updateForm(abc0);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc0 = this.abc0FormService.getAbc0(this.editForm);
    if (abc0.id !== null) {
      this.subscribeToSaveResponse(this.abc0Service.update(abc0));
    } else {
      this.subscribeToSaveResponse(this.abc0Service.create(abc0));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc0>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(abc0: IAbc0): void {
    this.abc0 = abc0;
    this.abc0FormService.resetForm(this.editForm, abc0);
  }
}
