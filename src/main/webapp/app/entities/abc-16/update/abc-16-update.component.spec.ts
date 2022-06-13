import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc16Service } from '../service/abc-16.service';
import { IAbc16, Abc16 } from '../abc-16.model';

import { Abc16UpdateComponent } from './abc-16-update.component';

describe('Abc16 Management Update Component', () => {
  let comp: Abc16UpdateComponent;
  let fixture: ComponentFixture<Abc16UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc16Service: Abc16Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc16UpdateComponent],
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
      .overrideTemplate(Abc16UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc16UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc16Service = TestBed.inject(Abc16Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc16: IAbc16 = { id: 456 };

      activatedRoute.data = of({ abc16 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc16));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc16>>();
      const abc16 = { id: 123 };
      jest.spyOn(abc16Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc16 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc16 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc16Service.update).toHaveBeenCalledWith(abc16);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc16>>();
      const abc16 = new Abc16();
      jest.spyOn(abc16Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc16 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc16 }));
      saveSubject.complete();

      // THEN
      expect(abc16Service.create).toHaveBeenCalledWith(abc16);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc16>>();
      const abc16 = { id: 123 };
      jest.spyOn(abc16Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc16 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc16Service.update).toHaveBeenCalledWith(abc16);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
