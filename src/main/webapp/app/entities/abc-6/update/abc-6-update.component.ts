import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc6, Abc6 } from '../abc-6.model';
import { Abc6Service } from '../service/abc-6.service';

@Component({
  selector: 'jhi-abc-6-update',
  templateUrl: './abc-6-update.component.html',
})
export class Abc6UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc6Service: Abc6Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc6 }) => {
      this.updateForm(abc6);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc6 = this.createFromForm();
    if (abc6.id !== undefined) {
      this.subscribeToSaveResponse(this.abc6Service.update(abc6));
    } else {
      this.subscribeToSaveResponse(this.abc6Service.create(abc6));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc6>>): void {
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

  protected updateForm(abc6: IAbc6): void {
    this.editForm.patchValue({
      id: abc6.id,
      name: abc6.name,
      otherField: abc6.otherField,
    });
  }

  protected createFromForm(): IAbc6 {
    return {
      ...new Abc6(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
