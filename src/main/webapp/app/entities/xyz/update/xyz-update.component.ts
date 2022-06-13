import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IXyz, Xyz } from '../xyz.model';
import { XyzService } from '../service/xyz.service';

@Component({
  selector: 'jhi-xyz-update',
  templateUrl: './xyz-update.component.html',
})
export class XyzUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    uniqueField: [null, [Validators.required]],
    anotherField: [],
  });

  constructor(protected xyzService: XyzService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ xyz }) => {
      this.updateForm(xyz);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const xyz = this.createFromForm();
    if (xyz.id !== undefined) {
      this.subscribeToSaveResponse(this.xyzService.update(xyz));
    } else {
      this.subscribeToSaveResponse(this.xyzService.create(xyz));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IXyz>>): void {
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

  protected updateForm(xyz: IXyz): void {
    this.editForm.patchValue({
      id: xyz.id,
      uniqueField: xyz.uniqueField,
      anotherField: xyz.anotherField,
    });
  }

  protected createFromForm(): IXyz {
    return {
      ...new Xyz(),
      id: this.editForm.get(['id'])!.value,
      uniqueField: this.editForm.get(['uniqueField'])!.value,
      anotherField: this.editForm.get(['anotherField'])!.value,
    };
  }
}
