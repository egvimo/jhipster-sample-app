import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc26, Abc26 } from '../abc-26.model';
import { Abc26Service } from '../service/abc-26.service';

@Component({
  selector: 'jhi-abc-26-update',
  templateUrl: './abc-26-update.component.html',
})
export class Abc26UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc26Service: Abc26Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc26 }) => {
      this.updateForm(abc26);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc26 = this.createFromForm();
    if (abc26.id !== undefined) {
      this.subscribeToSaveResponse(this.abc26Service.update(abc26));
    } else {
      this.subscribeToSaveResponse(this.abc26Service.create(abc26));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc26>>): void {
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

  protected updateForm(abc26: IAbc26): void {
    this.editForm.patchValue({
      id: abc26.id,
      name: abc26.name,
      otherField: abc26.otherField,
    });
  }

  protected createFromForm(): IAbc26 {
    return {
      ...new Abc26(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
