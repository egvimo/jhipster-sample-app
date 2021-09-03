jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DefService } from '../service/def.service';
import { IDef, Def } from '../def.model';
import { IXyz } from 'app/entities/xyz/xyz.model';
import { XyzService } from 'app/entities/xyz/service/xyz.service';

import { DefUpdateComponent } from './def-update.component';

describe('Component Tests', () => {
  describe('Def Management Update Component', () => {
    let comp: DefUpdateComponent;
    let fixture: ComponentFixture<DefUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let defService: DefService;
    let xyzService: XyzService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DefUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(DefUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DefUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      defService = TestBed.inject(DefService);
      xyzService = TestBed.inject(XyzService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Xyz query and add missing value', () => {
        const def: IDef = { id: 456 };
        const xyz: IXyz = { id: 42139 };
        def.xyz = xyz;

        const xyzCollection: IXyz[] = [{ id: 42716 }];
        jest.spyOn(xyzService, 'query').mockReturnValue(of(new HttpResponse({ body: xyzCollection })));
        const additionalXyzs = [xyz];
        const expectedCollection: IXyz[] = [...additionalXyzs, ...xyzCollection];
        jest.spyOn(xyzService, 'addXyzToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ def });
        comp.ngOnInit();

        expect(xyzService.query).toHaveBeenCalled();
        expect(xyzService.addXyzToCollectionIfMissing).toHaveBeenCalledWith(xyzCollection, ...additionalXyzs);
        expect(comp.xyzsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const def: IDef = { id: 456 };
        const xyz: IXyz = { id: 6893 };
        def.xyz = xyz;

        activatedRoute.data = of({ def });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(def));
        expect(comp.xyzsSharedCollection).toContain(xyz);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Def>>();
        const def = { id: 123 };
        jest.spyOn(defService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ def });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: def }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(defService.update).toHaveBeenCalledWith(def);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Def>>();
        const def = new Def();
        jest.spyOn(defService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ def });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: def }));
        saveSubject.complete();

        // THEN
        expect(defService.create).toHaveBeenCalledWith(def);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Def>>();
        const def = { id: 123 };
        jest.spyOn(defService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ def });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(defService.update).toHaveBeenCalledWith(def);
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
