import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc24, Abc24 } from '../abc-24.model';
import { Abc24Service } from '../service/abc-24.service';

@Component({
  selector: 'jhi-abc-24-update',
  templateUrl: './abc-24-update.component.html',
})
export class Abc24UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc24Service: Abc24Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc24 }) => {
      this.updateForm(abc24);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc24 = this.createFromForm();
    if (abc24.id !== undefined) {
      this.subscribeToSaveResponse(this.abc24Service.update(abc24));
    } else {
      this.subscribeToSaveResponse(this.abc24Service.create(abc24));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc24>>): void {
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

  protected updateForm(abc24: IAbc24): void {
    this.editForm.patchValue({
      id: abc24.id,
      name: abc24.name,
      otherField: abc24.otherField,
    });
  }

  protected createFromForm(): IAbc24 {
    return {
      ...new Abc24(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
