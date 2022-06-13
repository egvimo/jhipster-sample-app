import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc9, Abc9 } from '../abc-9.model';
import { Abc9Service } from '../service/abc-9.service';

@Component({
  selector: 'jhi-abc-9-update',
  templateUrl: './abc-9-update.component.html',
})
export class Abc9UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc9Service: Abc9Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc9 }) => {
      this.updateForm(abc9);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc9 = this.createFromForm();
    if (abc9.id !== undefined) {
      this.subscribeToSaveResponse(this.abc9Service.update(abc9));
    } else {
      this.subscribeToSaveResponse(this.abc9Service.create(abc9));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc9>>): void {
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

  protected updateForm(abc9: IAbc9): void {
    this.editForm.patchValue({
      id: abc9.id,
      name: abc9.name,
      otherField: abc9.otherField,
    });
  }

  protected createFromForm(): IAbc9 {
    return {
      ...new Abc9(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
