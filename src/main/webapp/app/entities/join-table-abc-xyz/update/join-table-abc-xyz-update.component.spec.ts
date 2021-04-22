jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { JoinTableAbcXyzService } from '../service/join-table-abc-xyz.service';
import { IJoinTableAbcXyz, JoinTableAbcXyz } from '../join-table-abc-xyz.model';
import { IAbc } from 'app/entities/abc/abc.model';
import { AbcService } from 'app/entities/abc/service/abc.service';
import { IXyz } from 'app/entities/xyz/xyz.model';
import { XyzService } from 'app/entities/xyz/service/xyz.service';

import { JoinTableAbcXyzUpdateComponent } from './join-table-abc-xyz-update.component';

describe('Component Tests', () => {
  describe('JoinTableAbcXyz Management Update Component', () => {
    let comp: JoinTableAbcXyzUpdateComponent;
    let fixture: ComponentFixture<JoinTableAbcXyzUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let joinTableAbcXyzService: JoinTableAbcXyzService;
    let abcService: AbcService;
    let xyzService: XyzService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [JoinTableAbcXyzUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(JoinTableAbcXyzUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JoinTableAbcXyzUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      joinTableAbcXyzService = TestBed.inject(JoinTableAbcXyzService);
      abcService = TestBed.inject(AbcService);
      xyzService = TestBed.inject(XyzService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Abc query and add missing value', () => {
        const joinTableAbcXyz: IJoinTableAbcXyz = { id: 456 };
        const abc: IAbc = { id: 49273 };
        joinTableAbcXyz.abc = abc;

        const abcCollection: IAbc[] = [{ id: 48434 }];
        spyOn(abcService, 'query').and.returnValue(of(new HttpResponse({ body: abcCollection })));
        const additionalAbcs = [abc];
        const expectedCollection: IAbc[] = [...additionalAbcs, ...abcCollection];
        spyOn(abcService, 'addAbcToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ joinTableAbcXyz });
        comp.ngOnInit();

        expect(abcService.query).toHaveBeenCalled();
        expect(abcService.addAbcToCollectionIfMissing).toHaveBeenCalledWith(abcCollection, ...additionalAbcs);
        expect(comp.abcsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Xyz query and add missing value', () => {
        const joinTableAbcXyz: IJoinTableAbcXyz = { id: 456 };
        const xyz: IXyz = { id: 81673 };
        joinTableAbcXyz.xyz = xyz;

        const xyzCollection: IXyz[] = [{ id: 22696 }];
        spyOn(xyzService, 'query').and.returnValue(of(new HttpResponse({ body: xyzCollection })));
        const additionalXyzs = [xyz];
        const expectedCollection: IXyz[] = [...additionalXyzs, ...xyzCollection];
        spyOn(xyzService, 'addXyzToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ joinTableAbcXyz });
        comp.ngOnInit();

        expect(xyzService.query).toHaveBeenCalled();
        expect(xyzService.addXyzToCollectionIfMissing).toHaveBeenCalledWith(xyzCollection, ...additionalXyzs);
        expect(comp.xyzsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const joinTableAbcXyz: IJoinTableAbcXyz = { id: 456 };
        const abc: IAbc = { id: 7104 };
        joinTableAbcXyz.abc = abc;
        const xyz: IXyz = { id: 78669 };
        joinTableAbcXyz.xyz = xyz;

        activatedRoute.data = of({ joinTableAbcXyz });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(joinTableAbcXyz));
        expect(comp.abcsSharedCollection).toContain(abc);
        expect(comp.xyzsSharedCollection).toContain(xyz);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const joinTableAbcXyz = { id: 123 };
        spyOn(joinTableAbcXyzService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ joinTableAbcXyz });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: joinTableAbcXyz }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(joinTableAbcXyzService.update).toHaveBeenCalledWith(joinTableAbcXyz);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const joinTableAbcXyz = new JoinTableAbcXyz();
        spyOn(joinTableAbcXyzService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ joinTableAbcXyz });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: joinTableAbcXyz }));
        saveSubject.complete();

        // THEN
        expect(joinTableAbcXyzService.create).toHaveBeenCalledWith(joinTableAbcXyz);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const joinTableAbcXyz = { id: 123 };
        spyOn(joinTableAbcXyzService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ joinTableAbcXyz });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(joinTableAbcXyzService.update).toHaveBeenCalledWith(joinTableAbcXyz);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackAbcById', () => {
        it('Should return tracked Abc primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAbcById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackXyzById', () => {
        it('Should return tracked Xyz primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackXyzById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
