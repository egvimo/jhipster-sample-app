import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAbc, Abc } from '../abc.model';
import { AbcService } from '../service/abc.service';
import { IXyz } from 'app/entities/xyz/xyz.model';
import { XyzService } from 'app/entities/xyz/service/xyz.service';

@Component({
  selector: 'jhi-abc-update',
  templateUrl: './abc-update.component.html',
})
export class AbcUpdateComponent implements OnInit {
  isSaving = false;

  xyzsCollection: IXyz[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    xyz: [],
  });

  constructor(
    protected abcService: AbcService,
    protected xyzService: XyzService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ abc }) => {
      this.updateForm(abc);

      this.loadRelationshipsOptions();
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

  trackXyzById(index: number, item: IXyz): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAbc>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
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
      xyz: abc.xyz,
    });

    this.xyzsCollection = this.xyzService.addXyzToCollectionIfMissing(this.xyzsCollection, abc.xyz);
  }

  protected loadRelationshipsOptions(): void {
    this.xyzService
      .query({ filter: 'abc-is-null' })
      .pipe(map((res: HttpResponse<IXyz[]>) => res.body ?? []))
      .pipe(map((xyzs: IXyz[]) => this.xyzService.addXyzToCollectionIfMissing(xyzs, this.editForm.get('xyz')!.value)))
      .subscribe((xyzs: IXyz[]) => (this.xyzsCollection = xyzs));
  }

  protected createFromForm(): IAbc {
    return {
      ...new Abc(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      xyz: this.editForm.get(['xyz'])!.value,
    };
  }
}
