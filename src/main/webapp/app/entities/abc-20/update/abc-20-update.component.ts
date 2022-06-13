import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc20, Abc20 } from '../abc-20.model';
import { Abc20Service } from '../service/abc-20.service';

@Component({
  selector: 'jhi-abc-20-update',
  templateUrl: './abc-20-update.component.html',
})
export class Abc20UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc20Service: Abc20Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc20 }) => {
      this.updateForm(abc20);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc20 = this.createFromForm();
    if (abc20.id !== undefined) {
      this.subscribeToSaveResponse(this.abc20Service.update(abc20));
    } else {
      this.subscribeToSaveResponse(this.abc20Service.create(abc20));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc20>>): void {
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

  protected updateForm(abc20: IAbc20): void {
    this.editForm.patchValue({
      id: abc20.id,
      name: abc20.name,
      otherField: abc20.otherField,
    });
  }

  protected createFromForm(): IAbc20 {
    return {
      ...new Abc20(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
