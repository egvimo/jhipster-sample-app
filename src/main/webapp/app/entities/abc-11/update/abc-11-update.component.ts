import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc11, Abc11 } from '../abc-11.model';
import { Abc11Service } from '../service/abc-11.service';

@Component({
  selector: 'jhi-abc-11-update',
  templateUrl: './abc-11-update.component.html',
})
export class Abc11UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc11Service: Abc11Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc11 }) => {
      this.updateForm(abc11);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc11 = this.createFromForm();
    if (abc11.id !== undefined) {
      this.subscribeToSaveResponse(this.abc11Service.update(abc11));
    } else {
      this.subscribeToSaveResponse(this.abc11Service.create(abc11));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc11>>): void {
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

  protected updateForm(abc11: IAbc11): void {
    this.editForm.patchValue({
      id: abc11.id,
      name: abc11.name,
      otherField: abc11.otherField,
    });
  }

  protected createFromForm(): IAbc11 {
    return {
      ...new Abc11(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
