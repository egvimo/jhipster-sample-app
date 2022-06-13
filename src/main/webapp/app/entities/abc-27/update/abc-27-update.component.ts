import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc27, Abc27 } from '../abc-27.model';
import { Abc27Service } from '../service/abc-27.service';

@Component({
  selector: 'jhi-abc-27-update',
  templateUrl: './abc-27-update.component.html',
})
export class Abc27UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc27Service: Abc27Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc27 }) => {
      this.updateForm(abc27);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc27 = this.createFromForm();
    if (abc27.id !== undefined) {
      this.subscribeToSaveResponse(this.abc27Service.update(abc27));
    } else {
      this.subscribeToSaveResponse(this.abc27Service.create(abc27));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc27>>): void {
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

  protected updateForm(abc27: IAbc27): void {
    this.editForm.patchValue({
      id: abc27.id,
      name: abc27.name,
      otherField: abc27.otherField,
    });
  }

  protected createFromForm(): IAbc27 {
    return {
      ...new Abc27(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
