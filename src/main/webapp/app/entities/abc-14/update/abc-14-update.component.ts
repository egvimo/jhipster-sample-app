import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc14, Abc14 } from '../abc-14.model';
import { Abc14Service } from '../service/abc-14.service';

@Component({
  selector: 'jhi-abc-14-update',
  templateUrl: './abc-14-update.component.html',
})
export class Abc14UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc14Service: Abc14Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc14 }) => {
      this.updateForm(abc14);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc14 = this.createFromForm();
    if (abc14.id !== undefined) {
      this.subscribeToSaveResponse(this.abc14Service.update(abc14));
    } else {
      this.subscribeToSaveResponse(this.abc14Service.create(abc14));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc14>>): void {
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

  protected updateForm(abc14: IAbc14): void {
    this.editForm.patchValue({
      id: abc14.id,
      name: abc14.name,
      otherField: abc14.otherField,
    });
  }

  protected createFromForm(): IAbc14 {
    return {
      ...new Abc14(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
