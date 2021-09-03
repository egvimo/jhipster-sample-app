import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDef, Def } from '../def.model';
import { DefService } from '../service/def.service';
import { IXyz } from 'app/entities/xyz/xyz.model';
import { XyzService } from 'app/entities/xyz/service/xyz.service';

@Component({
  selector: 'jhi-def-update',
  templateUrl: './def-update.component.html',
})
export class DefUpdateComponent implements OnInit {
  isSaving = false;

  xyzsSharedCollection: IXyz[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    xyz: [],
  });

  constructor(
    protected defService: DefService,
    protected xyzService: XyzService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ def }) => {
      this.updateForm(def);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const def = this.createFromForm();
    if (def.id !== undefined) {
      this.subscribeToSaveResponse(this.defService.update(def));
    } else {
      this.subscribeToSaveResponse(this.defService.create(def));
    }
  }

  trackXyzById(index: number, item: IXyz): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDef>>): void {
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

  protected updateForm(def: IDef): void {
    this.editForm.patchValue({
      id: def.id,
      name: def.name,
      xyz: def.xyz,
    });

    this.xyzsSharedCollection = this.xyzService.addXyzToCollectionIfMissing(this.xyzsSharedCollection, def.xyz);
  }

  protected loadRelationshipsOptions(): void {
    this.xyzService
      .query()
      .pipe(map((res: HttpResponse<IXyz[]>) => res.body ?? []))
      .pipe(map((xyzs: IXyz[]) => this.xyzService.addXyzToCollectionIfMissing(xyzs, this.editForm.get('xyz')!.value)))
      .subscribe((xyzs: IXyz[]) => (this.xyzsSharedCollection = xyzs));
  }

  protected createFromForm(): IDef {
    return {
      ...new Def(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      xyz: this.editForm.get(['xyz'])!.value,
    };
  }
}
