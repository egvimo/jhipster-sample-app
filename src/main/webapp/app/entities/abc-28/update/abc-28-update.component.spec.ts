import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc28Service } from '../service/abc-28.service';
import { IAbc28, Abc28 } from '../abc-28.model';

import { Abc28UpdateComponent } from './abc-28-update.component';

describe('Abc28 Management Update Component', () => {
  let comp: Abc28UpdateComponent;
  let fixture: ComponentFixture<Abc28UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc28Service: Abc28Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc28UpdateComponent],
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
      .overrideTemplate(Abc28UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc28UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc28Service = TestBed.inject(Abc28Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc28: IAbc28 = { id: 456 };

      activatedRoute.data = of({ abc28 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc28));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc28>>();
      const abc28 = { id: 123 };
      jest.spyOn(abc28Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc28 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc28 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc28Service.update).toHaveBeenCalledWith(abc28);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc28>>();
      const abc28 = new Abc28();
      jest.spyOn(abc28Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc28 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc28 }));
      saveSubject.complete();

      // THEN
      expect(abc28Service.create).toHaveBeenCalledWith(abc28);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc28>>();
      const abc28 = { id: 123 };
      jest.spyOn(abc28Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc28 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc28Service.update).toHaveBeenCalledWith(abc28);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
