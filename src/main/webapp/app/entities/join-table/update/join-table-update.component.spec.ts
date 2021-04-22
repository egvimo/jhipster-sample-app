jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { JoinTableService } from '../service/join-table.service';
import { IJoinTable, JoinTable } from '../join-table.model';
import { IAbc } from 'app/entities/abc/abc.model';
import { AbcService } from 'app/entities/abc/service/abc.service';
import { IXyz } from 'app/entities/xyz/xyz.model';
import { XyzService } from 'app/entities/xyz/service/xyz.service';

import { JoinTableUpdateComponent } from './join-table-update.component';

describe('Component Tests', () => {
  describe('JoinTable Management Update Component', () => {
    let comp: JoinTableUpdateComponent;
    let fixture: ComponentFixture<JoinTableUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let joinTableService: JoinTableService;
    let abcService: AbcService;
    let xyzService: XyzService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [JoinTableUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(JoinTableUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JoinTableUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      joinTableService = TestBed.inject(JoinTableService);
      abcService = TestBed.inject(AbcService);
      xyzService = TestBed.inject(XyzService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Abc query and add missing value', () => {
        const joinTable: IJoinTable = { id: 456 };
        const abc: IAbc = { id: 30878 };
        joinTable.abc = abc;

        const abcCollection: IAbc[] = [{ id: 60408 }];
        spyOn(abcService, 'query').and.returnValue(of(new HttpResponse({ body: abcCollection })));
        const additionalAbcs = [abc];
        const expectedCollection: IAbc[] = [...additionalAbcs, ...abcCollection];
        spyOn(abcService, 'addAbcToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ joinTable });
        comp.ngOnInit();

        expect(abcService.query).toHaveBeenCalled();
        expect(abcService.addAbcToCollectionIfMissing).toHaveBeenCalledWith(abcCollection, ...additionalAbcs);
        expect(comp.abcsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Xyz query and add missing value', () => {
        const joinTable: IJoinTable = { id: 456 };
        const xyz: IXyz = { id: 92988 };
        joinTable.xyz = xyz;

        const xyzCollection: IXyz[] = [{ id: 14306 }];
        spyOn(xyzService, 'query').and.returnValue(of(new HttpResponse({ body: xyzCollection })));
        const additionalXyzs = [xyz];
        const expectedCollection: IXyz[] = [...additionalXyzs, ...xyzCollection];
        spyOn(xyzService, 'addXyzToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ joinTable });
        comp.ngOnInit();

        expect(xyzService.query).toHaveBeenCalled();
        expect(xyzService.addXyzToCollectionIfMissing).toHaveBeenCalledWith(xyzCollection, ...additionalXyzs);
        expect(comp.xyzsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const joinTable: IJoinTable = { id: 456 };
        const abc: IAbc = { id: 82111 };
        joinTable.abc = abc;
        const xyz: IXyz = { id: 99825 };
        joinTable.xyz = xyz;

        activatedRoute.data = of({ joinTable });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(joinTable));
        expect(comp.abcsSharedCollection).toContain(abc);
        expect(comp.xyzsSharedCollection).toContain(xyz);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const joinTable = { id: 123 };
        spyOn(joinTableService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ joinTable });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: joinTable }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(joinTableService.update).toHaveBeenCalledWith(joinTable);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const joinTable = new JoinTable();
        spyOn(joinTableService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ joinTable });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: joinTable }));
        saveSubject.complete();

        // THEN
        expect(joinTableService.create).toHaveBeenCalledWith(joinTable);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const joinTable = { id: 123 };
        spyOn(joinTableService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ joinTable });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(joinTableService.update).toHaveBeenCalledWith(joinTable);
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
