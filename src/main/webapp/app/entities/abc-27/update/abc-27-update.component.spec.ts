import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc27Service } from '../service/abc-27.service';
import { IAbc27, Abc27 } from '../abc-27.model';

import { Abc27UpdateComponent } from './abc-27-update.component';

describe('Abc27 Management Update Component', () => {
  let comp: Abc27UpdateComponent;
  let fixture: ComponentFixture<Abc27UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc27Service: Abc27Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc27UpdateComponent],
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
      .overrideTemplate(Abc27UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc27UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc27Service = TestBed.inject(Abc27Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc27: IAbc27 = { id: 456 };

      activatedRoute.data = of({ abc27 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc27));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc27>>();
      const abc27 = { id: 123 };
      jest.spyOn(abc27Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc27 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc27 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc27Service.update).toHaveBeenCalledWith(abc27);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc27>>();
      const abc27 = new Abc27();
      jest.spyOn(abc27Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc27 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc27 }));
      saveSubject.complete();

      // THEN
      expect(abc27Service.create).toHaveBeenCalledWith(abc27);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc27>>();
      const abc27 = { id: 123 };
      jest.spyOn(abc27Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc27 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc27Service.update).toHaveBeenCalledWith(abc27);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
