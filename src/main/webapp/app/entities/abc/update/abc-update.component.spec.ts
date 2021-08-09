jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AbcService } from '../service/abc.service';
import { IAbc, Abc } from '../abc.model';

import { AbcUpdateComponent } from './abc-update.component';

describe('Component Tests', () => {
  describe('Abc Management Update Component', () => {
    let comp: AbcUpdateComponent;
    let fixture: ComponentFixture<AbcUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let abcService: AbcService;

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

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const abc: IAbc = { id: 456 };

        activatedRoute.data = of({ abc });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(abc));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Abc>>();
        const abc = { id: 123 };
        jest.spyOn(abcService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
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
        const saveSubject = new Subject<HttpResponse<Abc>>();
        const abc = new Abc();
        jest.spyOn(abcService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
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
        const saveSubject = new Subject<HttpResponse<Abc>>();
        const abc = { id: 123 };
        jest.spyOn(abcService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
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
  });
});
