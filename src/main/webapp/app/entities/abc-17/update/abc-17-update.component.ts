import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc17, Abc17 } from '../abc-17.model';
import { Abc17Service } from '../service/abc-17.service';

@Component({
  selector: 'jhi-abc-17-update',
  templateUrl: './abc-17-update.component.html',
})
export class Abc17UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc17Service: Abc17Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc17 }) => {
      this.updateForm(abc17);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc17 = this.createFromForm();
    if (abc17.id !== undefined) {
      this.subscribeToSaveResponse(this.abc17Service.update(abc17));
    } else {
      this.subscribeToSaveResponse(this.abc17Service.create(abc17));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc17>>): void {
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

  protected updateForm(abc17: IAbc17): void {
    this.editForm.patchValue({
      id: abc17.id,
      name: abc17.name,
      otherField: abc17.otherField,
    });
  }

  protected createFromForm(): IAbc17 {
    return {
      ...new Abc17(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
