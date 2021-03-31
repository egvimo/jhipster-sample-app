jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AbcService } from '../service/abc.service';
import { IAbc, Abc } from '../abc.model';
import { IXyz } from 'app/entities/xyz/xyz.model';
import { XyzService } from 'app/entities/xyz/service/xyz.service';

import { AbcUpdateComponent } from './abc-update.component';

describe('Component Tests', () => {
  describe('Abc Management Update Component', () => {
    let comp: AbcUpdateComponent;
    let fixture: ComponentFixture<AbcUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let abcService: AbcService;
    let xyzService: XyzService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AbcUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AbcUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AbcUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      abcService = TestBed.inject(AbcService);
      xyzService = TestBed.inject(XyzService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call xyz query and add missing value', () => {
        const abc: IAbc = { id: 456 };
        const xyz: IXyz = { id: 30878 };
        abc.xyz = xyz;

        const xyzCollection: IXyz[] = [{ id: 60408 }];
        spyOn(xyzService, 'query').and.returnValue(of(new HttpResponse({ body: xyzCollection })));
        const expectedCollection: IXyz[] = [xyz, ...xyzCollection];
        spyOn(xyzService, 'addXyzToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ abc });
        comp.ngOnInit();

        expect(xyzService.query).toHaveBeenCalled();
        expect(xyzService.addXyzToCollectionIfMissing).toHaveBeenCalledWith(xyzCollection, xyz);
        expect(comp.xyzsCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const abc: IAbc = { id: 456 };
        const xyz: IXyz = { id: 82111 };
        abc.xyz = xyz;

        activatedRoute.data = of({ abc });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(abc));
        expect(comp.xyzsCollection).toContain(xyz);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const abc = { id: 123 };
        spyOn(abcService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ abc });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: abc }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(abcService.update).toHaveBeenCalledWith(abc);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const abc = new Abc();
        spyOn(abcService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ abc });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: abc }));
        saveSubject.complete();

        // THEN
        expect(abcService.create).toHaveBeenCalledWith(abc);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const abc = { id: 123 };
        spyOn(abcService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ abc });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(abcService.update).toHaveBeenCalledWith(abc);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
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
