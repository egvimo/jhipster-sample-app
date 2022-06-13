import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc12, Abc12 } from '../abc-12.model';
import { Abc12Service } from '../service/abc-12.service';

@Component({
  selector: 'jhi-abc-12-update',
  templateUrl: './abc-12-update.component.html',
})
export class Abc12UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc12Service: Abc12Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc12 }) => {
      this.updateForm(abc12);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc12 = this.createFromForm();
    if (abc12.id !== undefined) {
      this.subscribeToSaveResponse(this.abc12Service.update(abc12));
    } else {
      this.subscribeToSaveResponse(this.abc12Service.create(abc12));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc12>>): void {
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

  protected updateForm(abc12: IAbc12): void {
    this.editForm.patchValue({
      id: abc12.id,
      name: abc12.name,
      otherField: abc12.otherField,
    });
  }

  protected createFromForm(): IAbc12 {
    return {
      ...new Abc12(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
