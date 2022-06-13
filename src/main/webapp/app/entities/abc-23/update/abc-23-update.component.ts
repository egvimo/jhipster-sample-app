import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc23, Abc23 } from '../abc-23.model';
import { Abc23Service } from '../service/abc-23.service';

@Component({
  selector: 'jhi-abc-23-update',
  templateUrl: './abc-23-update.component.html',
})
export class Abc23UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc23Service: Abc23Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc23 }) => {
      this.updateForm(abc23);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc23 = this.createFromForm();
    if (abc23.id !== undefined) {
      this.subscribeToSaveResponse(this.abc23Service.update(abc23));
    } else {
      this.subscribeToSaveResponse(this.abc23Service.create(abc23));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc23>>): void {
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

  protected updateForm(abc23: IAbc23): void {
    this.editForm.patchValue({
      id: abc23.id,
      name: abc23.name,
      otherField: abc23.otherField,
    });
  }

  protected createFromForm(): IAbc23 {
    return {
      ...new Abc23(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
