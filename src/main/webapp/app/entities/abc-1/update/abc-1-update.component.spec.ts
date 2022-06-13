import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc1Service } from '../service/abc-1.service';
import { IAbc1, Abc1 } from '../abc-1.model';

import { Abc1UpdateComponent } from './abc-1-update.component';

describe('Abc1 Management Update Component', () => {
  let comp: Abc1UpdateComponent;
  let fixture: ComponentFixture<Abc1UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc1Service: Abc1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc1UpdateComponent],
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
      .overrideTemplate(Abc1UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc1UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc1Service = TestBed.inject(Abc1Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc1: IAbc1 = { id: 456 };

      activatedRoute.data = of({ abc1 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc1));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc1>>();
      const abc1 = { id: 123 };
      jest.spyOn(abc1Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc1 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc1 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc1Service.update).toHaveBeenCalledWith(abc1);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc1>>();
      const abc1 = new Abc1();
      jest.spyOn(abc1Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc1 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc1 }));
      saveSubject.complete();

      // THEN
      expect(abc1Service.create).toHaveBeenCalledWith(abc1);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc1>>();
      const abc1 = { id: 123 };
      jest.spyOn(abc1Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc1 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc1Service.update).toHaveBeenCalledWith(abc1);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
