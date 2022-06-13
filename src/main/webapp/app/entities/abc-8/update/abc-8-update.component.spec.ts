import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc8Service } from '../service/abc-8.service';
import { IAbc8, Abc8 } from '../abc-8.model';

import { Abc8UpdateComponent } from './abc-8-update.component';

describe('Abc8 Management Update Component', () => {
  let comp: Abc8UpdateComponent;
  let fixture: ComponentFixture<Abc8UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc8Service: Abc8Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc8UpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(Abc8UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc8UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc8Service = TestBed.inject(Abc8Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc8: IAbc8 = { id: 456 };

      activatedRoute.data = of({ abc8 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc8));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc8>>();
      const abc8 = { id: 123 };
      jest.spyOn(abc8Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc8 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc8 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc8Service.update).toHaveBeenCalledWith(abc8);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc8>>();
      const abc8 = new Abc8();
      jest.spyOn(abc8Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc8 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc8 }));
      saveSubject.complete();

      // THEN
      expect(abc8Service.create).toHaveBeenCalledWith(abc8);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc8>>();
      const abc8 = { id: 123 };
      jest.spyOn(abc8Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc8 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc8Service.update).toHaveBeenCalledWith(abc8);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
