import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc3, Abc3 } from '../abc-3.model';
import { Abc3Service } from '../service/abc-3.service';

@Component({
  selector: 'jhi-abc-3-update',
  templateUrl: './abc-3-update.component.html',
})
export class Abc3UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc3Service: Abc3Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc3 }) => {
      this.updateForm(abc3);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc3 = this.createFromForm();
    if (abc3.id !== undefined) {
      this.subscribeToSaveResponse(this.abc3Service.update(abc3));
    } else {
      this.subscribeToSaveResponse(this.abc3Service.create(abc3));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc3>>): void {
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

  protected updateForm(abc3: IAbc3): void {
    this.editForm.patchValue({
      id: abc3.id,
      name: abc3.name,
      otherField: abc3.otherField,
    });
  }

  protected createFromForm(): IAbc3 {
    return {
      ...new Abc3(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
