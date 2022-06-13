import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc28, Abc28 } from '../abc-28.model';
import { Abc28Service } from '../service/abc-28.service';

@Component({
  selector: 'jhi-abc-28-update',
  templateUrl: './abc-28-update.component.html',
})
export class Abc28UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc28Service: Abc28Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc28 }) => {
      this.updateForm(abc28);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc28 = this.createFromForm();
    if (abc28.id !== undefined) {
      this.subscribeToSaveResponse(this.abc28Service.update(abc28));
    } else {
      this.subscribeToSaveResponse(this.abc28Service.create(abc28));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc28>>): void {
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

  protected updateForm(abc28: IAbc28): void {
    this.editForm.patchValue({
      id: abc28.id,
      name: abc28.name,
      otherField: abc28.otherField,
    });
  }

  protected createFromForm(): IAbc28 {
    return {
      ...new Abc28(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
