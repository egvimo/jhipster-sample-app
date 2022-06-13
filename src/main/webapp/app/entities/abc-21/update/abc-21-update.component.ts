import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc21, Abc21 } from '../abc-21.model';
import { Abc21Service } from '../service/abc-21.service';

@Component({
  selector: 'jhi-abc-21-update',
  templateUrl: './abc-21-update.component.html',
})
export class Abc21UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc21Service: Abc21Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc21 }) => {
      this.updateForm(abc21);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc21 = this.createFromForm();
    if (abc21.id !== undefined) {
      this.subscribeToSaveResponse(this.abc21Service.update(abc21));
    } else {
      this.subscribeToSaveResponse(this.abc21Service.create(abc21));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc21>>): void {
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

  protected updateForm(abc21: IAbc21): void {
    this.editForm.patchValue({
      id: abc21.id,
      name: abc21.name,
      otherField: abc21.otherField,
    });
  }

  protected createFromForm(): IAbc21 {
    return {
      ...new Abc21(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
