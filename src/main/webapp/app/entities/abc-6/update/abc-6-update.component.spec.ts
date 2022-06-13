import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc6Service } from '../service/abc-6.service';
import { IAbc6, Abc6 } from '../abc-6.model';

import { Abc6UpdateComponent } from './abc-6-update.component';

describe('Abc6 Management Update Component', () => {
  let comp: Abc6UpdateComponent;
  let fixture: ComponentFixture<Abc6UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc6Service: Abc6Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc6UpdateComponent],
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
      .overrideTemplate(Abc6UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc6UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc6Service = TestBed.inject(Abc6Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc6: IAbc6 = { id: 456 };

      activatedRoute.data = of({ abc6 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc6));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc6>>();
      const abc6 = { id: 123 };
      jest.spyOn(abc6Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc6 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc6 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc6Service.update).toHaveBeenCalledWith(abc6);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc6>>();
      const abc6 = new Abc6();
      jest.spyOn(abc6Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc6 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc6 }));
      saveSubject.complete();

      // THEN
      expect(abc6Service.create).toHaveBeenCalledWith(abc6);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc6>>();
      const abc6 = { id: 123 };
      jest.spyOn(abc6Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc6 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc6Service.update).toHaveBeenCalledWith(abc6);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
