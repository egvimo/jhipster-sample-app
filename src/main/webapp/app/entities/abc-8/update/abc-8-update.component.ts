import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc8, Abc8 } from '../abc-8.model';
import { Abc8Service } from '../service/abc-8.service';

@Component({
  selector: 'jhi-abc-8-update',
  templateUrl: './abc-8-update.component.html',
})
export class Abc8UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc8Service: Abc8Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc8 }) => {
      this.updateForm(abc8);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc8 = this.createFromForm();
    if (abc8.id !== undefined) {
      this.subscribeToSaveResponse(this.abc8Service.update(abc8));
    } else {
      this.subscribeToSaveResponse(this.abc8Service.create(abc8));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc8>>): void {
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

  protected updateForm(abc8: IAbc8): void {
    this.editForm.patchValue({
      id: abc8.id,
      name: abc8.name,
      otherField: abc8.otherField,
    });
  }

  protected createFromForm(): IAbc8 {
    return {
      ...new Abc8(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
