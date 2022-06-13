import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc22, Abc22 } from '../abc-22.model';
import { Abc22Service } from '../service/abc-22.service';

@Component({
  selector: 'jhi-abc-22-update',
  templateUrl: './abc-22-update.component.html',
})
export class Abc22UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc22Service: Abc22Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc22 }) => {
      this.updateForm(abc22);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc22 = this.createFromForm();
    if (abc22.id !== undefined) {
      this.subscribeToSaveResponse(this.abc22Service.update(abc22));
    } else {
      this.subscribeToSaveResponse(this.abc22Service.create(abc22));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc22>>): void {
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

  protected updateForm(abc22: IAbc22): void {
    this.editForm.patchValue({
      id: abc22.id,
      name: abc22.name,
      otherField: abc22.otherField,
    });
  }

  protected createFromForm(): IAbc22 {
    return {
      ...new Abc22(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
