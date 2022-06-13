import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc19, Abc19 } from '../abc-19.model';
import { Abc19Service } from '../service/abc-19.service';

@Component({
  selector: 'jhi-abc-19-update',
  templateUrl: './abc-19-update.component.html',
})
export class Abc19UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc19Service: Abc19Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc19 }) => {
      this.updateForm(abc19);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc19 = this.createFromForm();
    if (abc19.id !== undefined) {
      this.subscribeToSaveResponse(this.abc19Service.update(abc19));
    } else {
      this.subscribeToSaveResponse(this.abc19Service.create(abc19));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc19>>): void {
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

  protected updateForm(abc19: IAbc19): void {
    this.editForm.patchValue({
      id: abc19.id,
      name: abc19.name,
      otherField: abc19.otherField,
    });
  }

  protected createFromForm(): IAbc19 {
    return {
      ...new Abc19(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
