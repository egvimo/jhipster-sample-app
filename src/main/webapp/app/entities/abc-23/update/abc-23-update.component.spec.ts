import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc23Service } from '../service/abc-23.service';
import { IAbc23, Abc23 } from '../abc-23.model';

import { Abc23UpdateComponent } from './abc-23-update.component';

describe('Abc23 Management Update Component', () => {
  let comp: Abc23UpdateComponent;
  let fixture: ComponentFixture<Abc23UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc23Service: Abc23Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc23UpdateComponent],
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
      .overrideTemplate(Abc23UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc23UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc23Service = TestBed.inject(Abc23Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc23: IAbc23 = { id: 456 };

      activatedRoute.data = of({ abc23 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc23));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc23>>();
      const abc23 = { id: 123 };
      jest.spyOn(abc23Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc23 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc23 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc23Service.update).toHaveBeenCalledWith(abc23);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc23>>();
      const abc23 = new Abc23();
      jest.spyOn(abc23Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc23 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc23 }));
      saveSubject.complete();

      // THEN
      expect(abc23Service.create).toHaveBeenCalledWith(abc23);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc23>>();
      const abc23 = { id: 123 };
      jest.spyOn(abc23Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc23 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc23Service.update).toHaveBeenCalledWith(abc23);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
