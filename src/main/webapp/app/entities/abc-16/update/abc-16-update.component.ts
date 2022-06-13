import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc16, Abc16 } from '../abc-16.model';
import { Abc16Service } from '../service/abc-16.service';

@Component({
  selector: 'jhi-abc-16-update',
  templateUrl: './abc-16-update.component.html',
})
export class Abc16UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc16Service: Abc16Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc16 }) => {
      this.updateForm(abc16);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc16 = this.createFromForm();
    if (abc16.id !== undefined) {
      this.subscribeToSaveResponse(this.abc16Service.update(abc16));
    } else {
      this.subscribeToSaveResponse(this.abc16Service.create(abc16));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc16>>): void {
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

  protected updateForm(abc16: IAbc16): void {
    this.editForm.patchValue({
      id: abc16.id,
      name: abc16.name,
      otherField: abc16.otherField,
    });
  }

  protected createFromForm(): IAbc16 {
    return {
      ...new Abc16(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
