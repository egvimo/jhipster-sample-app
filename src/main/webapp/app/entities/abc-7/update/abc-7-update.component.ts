import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc7, Abc7 } from '../abc-7.model';
import { Abc7Service } from '../service/abc-7.service';

@Component({
  selector: 'jhi-abc-7-update',
  templateUrl: './abc-7-update.component.html',
})
export class Abc7UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc7Service: Abc7Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc7 }) => {
      this.updateForm(abc7);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc7 = this.createFromForm();
    if (abc7.id !== undefined) {
      this.subscribeToSaveResponse(this.abc7Service.update(abc7));
    } else {
      this.subscribeToSaveResponse(this.abc7Service.create(abc7));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc7>>): void {
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

  protected updateForm(abc7: IAbc7): void {
    this.editForm.patchValue({
      id: abc7.id,
      name: abc7.name,
      otherField: abc7.otherField,
    });
  }

  protected createFromForm(): IAbc7 {
    return {
      ...new Abc7(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
