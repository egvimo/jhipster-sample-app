import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc7Service } from '../service/abc-7.service';
import { IAbc7, Abc7 } from '../abc-7.model';

import { Abc7UpdateComponent } from './abc-7-update.component';

describe('Abc7 Management Update Component', () => {
  let comp: Abc7UpdateComponent;
  let fixture: ComponentFixture<Abc7UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc7Service: Abc7Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc7UpdateComponent],
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
      .overrideTemplate(Abc7UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc7UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc7Service = TestBed.inject(Abc7Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc7: IAbc7 = { id: 456 };

      activatedRoute.data = of({ abc7 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc7));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc7>>();
      const abc7 = { id: 123 };
      jest.spyOn(abc7Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc7 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc7 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc7Service.update).toHaveBeenCalledWith(abc7);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc7>>();
      const abc7 = new Abc7();
      jest.spyOn(abc7Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc7 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc7 }));
      saveSubject.complete();

      // THEN
      expect(abc7Service.create).toHaveBeenCalledWith(abc7);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc7>>();
      const abc7 = { id: 123 };
      jest.spyOn(abc7Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc7 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc7Service.update).toHaveBeenCalledWith(abc7);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
