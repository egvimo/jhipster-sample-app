import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc25, Abc25 } from '../abc-25.model';
import { Abc25Service } from '../service/abc-25.service';

@Component({
  selector: 'jhi-abc-25-update',
  templateUrl: './abc-25-update.component.html',
})
export class Abc25UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc25Service: Abc25Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc25 }) => {
      this.updateForm(abc25);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc25 = this.createFromForm();
    if (abc25.id !== undefined) {
      this.subscribeToSaveResponse(this.abc25Service.update(abc25));
    } else {
      this.subscribeToSaveResponse(this.abc25Service.create(abc25));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc25>>): void {
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

  protected updateForm(abc25: IAbc25): void {
    this.editForm.patchValue({
      id: abc25.id,
      name: abc25.name,
      otherField: abc25.otherField,
    });
  }

  protected createFromForm(): IAbc25 {
    return {
      ...new Abc25(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
