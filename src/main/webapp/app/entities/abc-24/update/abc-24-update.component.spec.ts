import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc24Service } from '../service/abc-24.service';
import { IAbc24, Abc24 } from '../abc-24.model';

import { Abc24UpdateComponent } from './abc-24-update.component';

describe('Abc24 Management Update Component', () => {
  let comp: Abc24UpdateComponent;
  let fixture: ComponentFixture<Abc24UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc24Service: Abc24Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc24UpdateComponent],
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
      .overrideTemplate(Abc24UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc24UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc24Service = TestBed.inject(Abc24Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc24: IAbc24 = { id: 456 };

      activatedRoute.data = of({ abc24 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc24));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc24>>();
      const abc24 = { id: 123 };
      jest.spyOn(abc24Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc24 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc24 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc24Service.update).toHaveBeenCalledWith(abc24);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc24>>();
      const abc24 = new Abc24();
      jest.spyOn(abc24Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc24 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc24 }));
      saveSubject.complete();

      // THEN
      expect(abc24Service.create).toHaveBeenCalledWith(abc24);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc24>>();
      const abc24 = { id: 123 };
      jest.spyOn(abc24Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc24 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc24Service.update).toHaveBeenCalledWith(abc24);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
