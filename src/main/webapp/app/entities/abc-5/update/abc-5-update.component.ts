import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc5, Abc5 } from '../abc-5.model';
import { Abc5Service } from '../service/abc-5.service';

@Component({
  selector: 'jhi-abc-5-update',
  templateUrl: './abc-5-update.component.html',
})
export class Abc5UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc5Service: Abc5Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc5 }) => {
      this.updateForm(abc5);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc5 = this.createFromForm();
    if (abc5.id !== undefined) {
      this.subscribeToSaveResponse(this.abc5Service.update(abc5));
    } else {
      this.subscribeToSaveResponse(this.abc5Service.create(abc5));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc5>>): void {
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

  protected updateForm(abc5: IAbc5): void {
    this.editForm.patchValue({
      id: abc5.id,
      name: abc5.name,
      otherField: abc5.otherField,
    });
  }

  protected createFromForm(): IAbc5 {
    return {
      ...new Abc5(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
