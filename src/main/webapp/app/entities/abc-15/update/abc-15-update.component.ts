import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAbc15, Abc15 } from '../abc-15.model';
import { Abc15Service } from '../service/abc-15.service';

@Component({
  selector: 'jhi-abc-15-update',
  templateUrl: './abc-15-update.component.html',
})
export class Abc15UpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    otherField: [],
  });

  constructor(protected abc15Service: Abc15Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc15 }) => {
      this.updateForm(abc15);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const abc15 = this.createFromForm();
    if (abc15.id !== undefined) {
      this.subscribeToSaveResponse(this.abc15Service.update(abc15));
    } else {
      this.subscribeToSaveResponse(this.abc15Service.create(abc15));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc15>>): void {
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

  protected updateForm(abc15: IAbc15): void {
    this.editForm.patchValue({
      id: abc15.id,
      name: abc15.name,
      otherField: abc15.otherField,
    });
  }

  protected createFromForm(): IAbc15 {
    return {
      ...new Abc15(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      otherField: this.editForm.get(['otherField'])!.value,
    };
  }
}
