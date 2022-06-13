import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc10Service } from '../service/abc-10.service';
import { IAbc10, Abc10 } from '../abc-10.model';

import { Abc10UpdateComponent } from './abc-10-update.component';

describe('Abc10 Management Update Component', () => {
  let comp: Abc10UpdateComponent;
  let fixture: ComponentFixture<Abc10UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc10Service: Abc10Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc10UpdateComponent],
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
      .overrideTemplate(Abc10UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc10UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc10Service = TestBed.inject(Abc10Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc10: IAbc10 = { id: 456 };

      activatedRoute.data = of({ abc10 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc10));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc10>>();
      const abc10 = { id: 123 };
      jest.spyOn(abc10Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc10 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc10 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc10Service.update).toHaveBeenCalledWith(abc10);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc10>>();
      const abc10 = new Abc10();
      jest.spyOn(abc10Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc10 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc10 }));
      saveSubject.complete();

      // THEN
      expect(abc10Service.create).toHaveBeenCalledWith(abc10);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc10>>();
      const abc10 = { id: 123 };
      jest.spyOn(abc10Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc10 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc10Service.update).toHaveBeenCalledWith(abc10);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
