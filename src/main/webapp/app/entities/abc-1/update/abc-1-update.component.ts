import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc1, Abc1 } from '../abc-1.model';
import { Abc1Service } from '../service/abc-1.service';

@Component({
  selector: 'jhi-abc-1-update',
  templateUrl: './abc-1-update.component.html',
})
export class Abc1UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc1Service: Abc1Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc1 }) => {
      this.updateForm(abc1);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc1 = this.createFromForm();
    if (abc1.id !== undefined) {
      this.subscribeToSaveResponse(this.abc1Service.update(abc1));
    } else {
      this.subscribeToSaveResponse(this.abc1Service.create(abc1));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc1>>): void {
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

  protected updateForm(abc1: IAbc1): void {
    this.editForm.patchValue({
      id: abc1.id,
      name: abc1.name,
      otherField: abc1.otherField,
    });
  }

  protected createFromForm(): IAbc1 {
    return {
      ...new Abc1(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
