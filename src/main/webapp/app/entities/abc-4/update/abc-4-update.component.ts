import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc4, Abc4 } from '../abc-4.model';
import { Abc4Service } from '../service/abc-4.service';

@Component({
  selector: 'jhi-abc-4-update',
  templateUrl: './abc-4-update.component.html',
})
export class Abc4UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc4Service: Abc4Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc4 }) => {
      this.updateForm(abc4);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc4 = this.createFromForm();
    if (abc4.id !== undefined) {
      this.subscribeToSaveResponse(this.abc4Service.update(abc4));
    } else {
      this.subscribeToSaveResponse(this.abc4Service.create(abc4));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc4>>): void {
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

  protected updateForm(abc4: IAbc4): void {
    this.editForm.patchValue({
      id: abc4.id,
      name: abc4.name,
      otherField: abc4.otherField,
    });
  }

  protected createFromForm(): IAbc4 {
    return {
      ...new Abc4(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
