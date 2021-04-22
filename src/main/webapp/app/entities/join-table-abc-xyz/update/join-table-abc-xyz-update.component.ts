import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IJoinTableAbcXyz, JoinTableAbcXyz } from '../join-table-abc-xyz.model';
import { JoinTableAbcXyzService } from '../service/join-table-abc-xyz.service';
import { IAbc } from 'app/entities/abc/abc.model';
import { AbcService } from 'app/entities/abc/service/abc.service';
import { IXyz } from 'app/entities/xyz/xyz.model';
import { XyzService } from 'app/entities/xyz/service/xyz.service';

@Component({
  selector: 'jhi-join-table-abc-xyz-update',
  templateUrl: './join-table-abc-xyz-update.component.html',
})
export class JoinTableAbcXyzUpdateComponent implements OnInit {
  isSaving = false;

  abcsSharedCollection: IAbc[] = [];
  xyzsSharedCollection: IXyz[] = [];

  editForm = this.fb.group({
    id: [],
    additionalColumn: [null, [Validators.required]],
    abc: [null, Validators.required],
    xyz: [null, Validators.required],
  });

  constructor(
    protected joinTableAbcXyzService: JoinTableAbcXyzService,
    protected abcService: AbcService,
    protected xyzService: XyzService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ joinTableAbcXyz }) => {
      this.updateForm(joinTableAbcXyz);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const joinTableAbcXyz = this.createFromForm();
    if (joinTableAbcXyz.id !== undefined) {
      this.subscribeToSaveResponse(this.joinTableAbcXyzService.update(joinTableAbcXyz));
    } else {
      this.subscribeToSaveResponse(this.joinTableAbcXyzService.create(joinTableAbcXyz));
    }
  }

  trackAbcById(index: number, item: IAbc): number {
    return item.id!;
  }

  trackXyzById(index: number, item: IXyz): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJoinTableAbcXyz>>): void {
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

  protected updateForm(joinTableAbcXyz: IJoinTableAbcXyz): void {
    this.editForm.patchValue({
      id: joinTableAbcXyz.id,
      additionalColumn: joinTableAbcXyz.additionalColumn,
      abc: joinTableAbcXyz.abc,
      xyz: joinTableAbcXyz.xyz,
    });

    this.abcsSharedCollection = this.abcService.addAbcToCollectionIfMissing(this.abcsSharedCollection, joinTableAbcXyz.abc);
    this.xyzsSharedCollection = this.xyzService.addXyzToCollectionIfMissing(this.xyzsSharedCollection, joinTableAbcXyz.xyz);
  }

  protected loadRelationshipsOptions(): void {
    this.abcService
      .query()
      .pipe(map((res: HttpResponse<IAbc[]>) => res.body ?? []))
      .pipe(map((abcs: IAbc[]) => this.abcService.addAbcToCollectionIfMissing(abcs, this.editForm.get('abc')!.value)))
      .subscribe((abcs: IAbc[]) => (this.abcsSharedCollection = abcs));

    this.xyzService
      .query()
      .pipe(map((res: HttpResponse<IXyz[]>) => res.body ?? []))
      .pipe(map((xyzs: IXyz[]) => this.xyzService.addXyzToCollectionIfMissing(xyzs, this.editForm.get('xyz')!.value)))
      .subscribe((xyzs: IXyz[]) => (this.xyzsSharedCollection = xyzs));
  }

  protected createFromForm(): IJoinTableAbcXyz {
    return {
      ...new JoinTableAbcXyz(),
      id: this.editForm.get(['id'])!.value,
      additionalColumn: this.editForm.get(['additionalColumn'])!.value,
      abc: this.editForm.get(['abc'])!.value,
      xyz: this.editForm.get(['xyz'])!.value,
    };
  }
}
