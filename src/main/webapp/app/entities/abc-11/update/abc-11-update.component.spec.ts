import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc11Service } from '../service/abc-11.service';
import { IAbc11, Abc11 } from '../abc-11.model';

import { Abc11UpdateComponent } from './abc-11-update.component';

describe('Abc11 Management Update Component', () => {
  let comp: Abc11UpdateComponent;
  let fixture: ComponentFixture<Abc11UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc11Service: Abc11Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc11UpdateComponent],
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
      .overrideTemplate(Abc11UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc11UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc11Service = TestBed.inject(Abc11Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc11: IAbc11 = { id: 456 };

      activatedRoute.data = of({ abc11 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc11));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc11>>();
      const abc11 = { id: 123 };
      jest.spyOn(abc11Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc11 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc11 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc11Service.update).toHaveBeenCalledWith(abc11);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc11>>();
      const abc11 = new Abc11();
      jest.spyOn(abc11Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc11 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc11 }));
      saveSubject.complete();

      // THEN
      expect(abc11Service.create).toHaveBeenCalledWith(abc11);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc11>>();
      const abc11 = { id: 123 };
      jest.spyOn(abc11Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc11 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc11Service.update).toHaveBeenCalledWith(abc11);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
