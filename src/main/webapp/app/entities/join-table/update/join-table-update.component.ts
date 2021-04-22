import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IJoinTable, JoinTable } from '../join-table.model';
import { JoinTableService } from '../service/join-table.service';
import { IAbc } from 'app/entities/abc/abc.model';
import { AbcService } from 'app/entities/abc/service/abc.service';
import { IXyz } from 'app/entities/xyz/xyz.model';
import { XyzService } from 'app/entities/xyz/service/xyz.service';

@Component({
  selector: 'jhi-join-table-update',
  templateUrl: './join-table-update.component.html',
})
export class JoinTableUpdateComponent implements OnInit {
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
    protected joinTableService: JoinTableService,
    protected abcService: AbcService,
    protected xyzService: XyzService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ joinTable }) => {
      this.updateForm(joinTable);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const joinTable = this.createFromForm();
    if (joinTable.id !== undefined) {
      this.subscribeToSaveResponse(this.joinTableService.update(joinTable));
    } else {
      this.subscribeToSaveResponse(this.joinTableService.create(joinTable));
    }
  }

  trackAbcById(index: number, item: IAbc): number {
    return item.id!;
  }

  trackXyzById(index: number, item: IXyz): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJoinTable>>): void {
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

  protected updateForm(joinTable: IJoinTable): void {
    this.editForm.patchValue({
      id: joinTable.id,
      additionalColumn: joinTable.additionalColumn,
      abc: joinTable.abc,
      xyz: joinTable.xyz,
    });

    this.abcsSharedCollection = this.abcService.addAbcToCollectionIfMissing(this.abcsSharedCollection, joinTable.abc);
    this.xyzsSharedCollection = this.xyzService.addXyzToCollectionIfMissing(this.xyzsSharedCollection, joinTable.xyz);
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

  protected createFromForm(): IJoinTable {
    return {
      ...new JoinTable(),
      id: this.editForm.get(['id'])!.value,
      additionalColumn: this.editForm.get(['additionalColumn'])!.value,
      abc: this.editForm.get(['abc'])!.value,
      xyz: this.editForm.get(['xyz'])!.value,
    };
  }
}
