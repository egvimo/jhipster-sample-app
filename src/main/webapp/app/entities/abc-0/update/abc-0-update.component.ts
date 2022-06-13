import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc0, Abc0 } from '../abc-0.model';
import { Abc0Service } from '../service/abc-0.service';

@Component({
  selector: 'jhi-abc-0-update',
  templateUrl: './abc-0-update.component.html',
})
export class Abc0UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc0Service: Abc0Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc0 }) => {
      this.updateForm(abc0);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc0 = this.createFromForm();
    if (abc0.id !== undefined) {
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
    this.editForm.patchValue({
      id: abc0.id,
      name: abc0.name,
      otherField: abc0.otherField,
    });
  }

  protected createFromForm(): IAbc0 {
    return {
      ...new Abc0(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
