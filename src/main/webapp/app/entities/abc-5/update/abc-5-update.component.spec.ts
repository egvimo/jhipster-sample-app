import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc5Service } from '../service/abc-5.service';
import { IAbc5, Abc5 } from '../abc-5.model';

import { Abc5UpdateComponent } from './abc-5-update.component';

describe('Abc5 Management Update Component', () => {
  let comp: Abc5UpdateComponent;
  let fixture: ComponentFixture<Abc5UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc5Service: Abc5Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc5UpdateComponent],
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
      .overrideTemplate(Abc5UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc5UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc5Service = TestBed.inject(Abc5Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc5: IAbc5 = { id: 456 };

      activatedRoute.data = of({ abc5 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc5));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc5>>();
      const abc5 = { id: 123 };
      jest.spyOn(abc5Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc5 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc5 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc5Service.update).toHaveBeenCalledWith(abc5);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc5>>();
      const abc5 = new Abc5();
      jest.spyOn(abc5Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc5 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc5 }));
      saveSubject.complete();

      // THEN
      expect(abc5Service.create).toHaveBeenCalledWith(abc5);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc5>>();
      const abc5 = { id: 123 };
      jest.spyOn(abc5Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc5 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc5Service.update).toHaveBeenCalledWith(abc5);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
