import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc2, Abc2 } from '../abc-2.model';
import { Abc2Service } from '../service/abc-2.service';

@Component({
  selector: 'jhi-abc-2-update',
  templateUrl: './abc-2-update.component.html',
})
export class Abc2UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc2Service: Abc2Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc2 }) => {
      this.updateForm(abc2);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc2 = this.createFromForm();
    if (abc2.id !== undefined) {
      this.subscribeToSaveResponse(this.abc2Service.update(abc2));
    } else {
      this.subscribeToSaveResponse(this.abc2Service.create(abc2));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc2>>): void {
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

  protected updateForm(abc2: IAbc2): void {
    this.editForm.patchValue({
      id: abc2.id,
      name: abc2.name,
      otherField: abc2.otherField,
    });
  }

  protected createFromForm(): IAbc2 {
    return {
      ...new Abc2(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
