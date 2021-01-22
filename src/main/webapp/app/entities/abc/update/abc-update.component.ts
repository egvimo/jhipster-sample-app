import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IAbc, Abc } from '../abc.model';
import { AbcService } from '../service/abc.service';

@Component({
  selector: 'jhi-abc-update',
  templateUrl: './abc-update.component.html',
})
export class AbcUpdateComponent implements OnInit {
  isSaving = false;
  abcs: IAbc[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    parent: [],
  });

  constructor(protected abcService: AbcService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc }) => {
      this.updateForm(abc);

      this.abcService.query().subscribe((res: HttpResponse<IAbc[]>) => (this.abcs = res.body ?? []));
    });
  }

  updateForm(abc: IAbc): void {
    this.editForm.patchValue({
      id: abc.id,
      name: abc.name,
      parent: abc.parent,
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

  private createFromForm(): IAbc {
    return {
      ...new Abc(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      parent: this.editForm.get(['parent'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackAbcById(index: number, item: IAbc): number {
    return item.id!;
  }
}
