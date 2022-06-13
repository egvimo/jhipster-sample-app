import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc, Abc } from '../abc.model';
import { AbcService } from '../service/abc.service';

@Component({
  selector: 'jhi-abc-update',
  templateUrl: './abc-update.component.html',
})
export class AbcUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abcService: AbcService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc }) => {
      this.updateForm(abc);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc = this.createFromForm();
    if (abc.id !== undefined) {
      this.subscribeToSaveResponse(this.abcService.update(abc));
    } else {
      this.subscribeToSaveResponse(this.abcService.create(abc));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc>>): void {
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

  protected updateForm(abc: IAbc): void {
    this.editForm.patchValue({
      id: abc.id,
      name: abc.name,
      otherField: abc.otherField,
    });
  }

  protected createFromForm(): IAbc {
    return {
      ...new Abc(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
