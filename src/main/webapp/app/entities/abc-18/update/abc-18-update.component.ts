import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc18, Abc18 } from '../abc-18.model';
import { Abc18Service } from '../service/abc-18.service';

@Component({
  selector: 'jhi-abc-18-update',
  templateUrl: './abc-18-update.component.html',
})
export class Abc18UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc18Service: Abc18Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc18 }) => {
      this.updateForm(abc18);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc18 = this.createFromForm();
    if (abc18.id !== undefined) {
      this.subscribeToSaveResponse(this.abc18Service.update(abc18));
    } else {
      this.subscribeToSaveResponse(this.abc18Service.create(abc18));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc18>>): void {
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

  protected updateForm(abc18: IAbc18): void {
    this.editForm.patchValue({
      id: abc18.id,
      name: abc18.name,
      otherField: abc18.otherField,
    });
  }

  protected createFromForm(): IAbc18 {
    return {
      ...new Abc18(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
