import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc9Service } from '../service/abc-9.service';
import { IAbc9, Abc9 } from '../abc-9.model';

import { Abc9UpdateComponent } from './abc-9-update.component';

describe('Abc9 Management Update Component', () => {
  let comp: Abc9UpdateComponent;
  let fixture: ComponentFixture<Abc9UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc9Service: Abc9Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc9UpdateComponent],
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
      .overrideTemplate(Abc9UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc9UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc9Service = TestBed.inject(Abc9Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc9: IAbc9 = { id: 456 };

      activatedRoute.data = of({ abc9 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc9));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc9>>();
      const abc9 = { id: 123 };
      jest.spyOn(abc9Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc9 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc9 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc9Service.update).toHaveBeenCalledWith(abc9);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc9>>();
      const abc9 = new Abc9();
      jest.spyOn(abc9Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc9 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc9 }));
      saveSubject.complete();

      // THEN
      expect(abc9Service.create).toHaveBeenCalledWith(abc9);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc9>>();
      const abc9 = { id: 123 };
      jest.spyOn(abc9Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc9 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc9Service.update).toHaveBeenCalledWith(abc9);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
