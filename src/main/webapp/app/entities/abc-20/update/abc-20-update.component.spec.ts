import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc20Service } from '../service/abc-20.service';
import { IAbc20, Abc20 } from '../abc-20.model';

import { Abc20UpdateComponent } from './abc-20-update.component';

describe('Abc20 Management Update Component', () => {
  let comp: Abc20UpdateComponent;
  let fixture: ComponentFixture<Abc20UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc20Service: Abc20Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc20UpdateComponent],
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
      .overrideTemplate(Abc20UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc20UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc20Service = TestBed.inject(Abc20Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc20: IAbc20 = { id: 456 };

      activatedRoute.data = of({ abc20 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc20));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc20>>();
      const abc20 = { id: 123 };
      jest.spyOn(abc20Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc20 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc20 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc20Service.update).toHaveBeenCalledWith(abc20);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc20>>();
      const abc20 = new Abc20();
      jest.spyOn(abc20Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc20 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc20 }));
      saveSubject.complete();

      // THEN
      expect(abc20Service.create).toHaveBeenCalledWith(abc20);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc20>>();
      const abc20 = { id: 123 };
      jest.spyOn(abc20Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc20 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc20Service.update).toHaveBeenCalledWith(abc20);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
