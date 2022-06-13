import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc25Service } from '../service/abc-25.service';
import { IAbc25, Abc25 } from '../abc-25.model';

import { Abc25UpdateComponent } from './abc-25-update.component';

describe('Abc25 Management Update Component', () => {
  let comp: Abc25UpdateComponent;
  let fixture: ComponentFixture<Abc25UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc25Service: Abc25Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc25UpdateComponent],
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
      .overrideTemplate(Abc25UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc25UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc25Service = TestBed.inject(Abc25Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc25: IAbc25 = { id: 456 };

      activatedRoute.data = of({ abc25 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc25));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc25>>();
      const abc25 = { id: 123 };
      jest.spyOn(abc25Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc25 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc25 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc25Service.update).toHaveBeenCalledWith(abc25);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc25>>();
      const abc25 = new Abc25();
      jest.spyOn(abc25Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc25 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc25 }));
      saveSubject.complete();

      // THEN
      expect(abc25Service.create).toHaveBeenCalledWith(abc25);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc25>>();
      const abc25 = { id: 123 };
      jest.spyOn(abc25Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc25 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc25Service.update).toHaveBeenCalledWith(abc25);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
