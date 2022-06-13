import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc14Service } from '../service/abc-14.service';
import { IAbc14, Abc14 } from '../abc-14.model';

import { Abc14UpdateComponent } from './abc-14-update.component';

describe('Abc14 Management Update Component', () => {
  let comp: Abc14UpdateComponent;
  let fixture: ComponentFixture<Abc14UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc14Service: Abc14Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc14UpdateComponent],
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
      .overrideTemplate(Abc14UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc14UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc14Service = TestBed.inject(Abc14Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc14: IAbc14 = { id: 456 };

      activatedRoute.data = of({ abc14 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc14));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc14>>();
      const abc14 = { id: 123 };
      jest.spyOn(abc14Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc14 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc14 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc14Service.update).toHaveBeenCalledWith(abc14);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc14>>();
      const abc14 = new Abc14();
      jest.spyOn(abc14Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc14 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc14 }));
      saveSubject.complete();

      // THEN
      expect(abc14Service.create).toHaveBeenCalledWith(abc14);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc14>>();
      const abc14 = { id: 123 };
      jest.spyOn(abc14Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc14 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc14Service.update).toHaveBeenCalledWith(abc14);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
