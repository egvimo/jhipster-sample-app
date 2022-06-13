import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc10, Abc10 } from '../abc-10.model';
import { Abc10Service } from '../service/abc-10.service';

@Component({
  selector: 'jhi-abc-10-update',
  templateUrl: './abc-10-update.component.html',
})
export class Abc10UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc10Service: Abc10Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc10 }) => {
      this.updateForm(abc10);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc10 = this.createFromForm();
    if (abc10.id !== undefined) {
      this.subscribeToSaveResponse(this.abc10Service.update(abc10));
    } else {
      this.subscribeToSaveResponse(this.abc10Service.create(abc10));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc10>>): void {
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

  protected updateForm(abc10: IAbc10): void {
    this.editForm.patchValue({
      id: abc10.id,
      name: abc10.name,
      otherField: abc10.otherField,
    });
  }

  protected createFromForm(): IAbc10 {
    return {
      ...new Abc10(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
