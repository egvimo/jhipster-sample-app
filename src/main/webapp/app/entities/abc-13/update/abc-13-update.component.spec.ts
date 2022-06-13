import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc13Service } from '../service/abc-13.service';
import { IAbc13, Abc13 } from '../abc-13.model';

import { Abc13UpdateComponent } from './abc-13-update.component';

describe('Abc13 Management Update Component', () => {
  let comp: Abc13UpdateComponent;
  let fixture: ComponentFixture<Abc13UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc13Service: Abc13Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc13UpdateComponent],
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
      .overrideTemplate(Abc13UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc13UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc13Service = TestBed.inject(Abc13Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc13: IAbc13 = { id: 456 };

      activatedRoute.data = of({ abc13 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc13));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc13>>();
      const abc13 = { id: 123 };
      jest.spyOn(abc13Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc13 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc13 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc13Service.update).toHaveBeenCalledWith(abc13);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc13>>();
      const abc13 = new Abc13();
      jest.spyOn(abc13Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc13 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc13 }));
      saveSubject.complete();

      // THEN
      expect(abc13Service.create).toHaveBeenCalledWith(abc13);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc13>>();
      const abc13 = { id: 123 };
      jest.spyOn(abc13Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc13 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc13Service.update).toHaveBeenCalledWith(abc13);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
