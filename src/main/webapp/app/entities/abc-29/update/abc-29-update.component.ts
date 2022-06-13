import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc29, Abc29 } from '../abc-29.model';
import { Abc29Service } from '../service/abc-29.service';

@Component({
  selector: 'jhi-abc-29-update',
  templateUrl: './abc-29-update.component.html',
})
export class Abc29UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc29Service: Abc29Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc29 }) => {
      this.updateForm(abc29);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc29 = this.createFromForm();
    if (abc29.id !== undefined) {
      this.subscribeToSaveResponse(this.abc29Service.update(abc29));
    } else {
      this.subscribeToSaveResponse(this.abc29Service.create(abc29));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc29>>): void {
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

  protected updateForm(abc29: IAbc29): void {
    this.editForm.patchValue({
      id: abc29.id,
      name: abc29.name,
      otherField: abc29.otherField,
    });
  }

  protected createFromForm(): IAbc29 {
    return {
      ...new Abc29(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
