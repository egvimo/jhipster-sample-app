import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc13, Abc13 } from '../abc-13.model';
import { Abc13Service } from '../service/abc-13.service';

@Component({
  selector: 'jhi-abc-13-update',
  templateUrl: './abc-13-update.component.html',
})
export class Abc13UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc13Service: Abc13Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc13 }) => {
      this.updateForm(abc13);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc13 = this.createFromForm();
    if (abc13.id !== undefined) {
      this.subscribeToSaveResponse(this.abc13Service.update(abc13));
    } else {
      this.subscribeToSaveResponse(this.abc13Service.create(abc13));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc13>>): void {
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

  protected updateForm(abc13: IAbc13): void {
    this.editForm.patchValue({
      id: abc13.id,
      name: abc13.name,
      otherField: abc13.otherField,
    });
  }

  protected createFromForm(): IAbc13 {
    return {
      ...new Abc13(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
