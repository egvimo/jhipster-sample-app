import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc3Service } from '../service/abc-3.service';
import { IAbc3, Abc3 } from '../abc-3.model';

import { Abc3UpdateComponent } from './abc-3-update.component';

describe('Abc3 Management Update Component', () => {
  let comp: Abc3UpdateComponent;
  let fixture: ComponentFixture<Abc3UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc3Service: Abc3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc3UpdateComponent],
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
      .overrideTemplate(Abc3UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc3UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc3Service = TestBed.inject(Abc3Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc3: IAbc3 = { id: 456 };

      activatedRoute.data = of({ abc3 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc3));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc3>>();
      const abc3 = { id: 123 };
      jest.spyOn(abc3Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc3 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc3 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc3Service.update).toHaveBeenCalledWith(abc3);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc3>>();
      const abc3 = new Abc3();
      jest.spyOn(abc3Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc3 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc3 }));
      saveSubject.complete();

      // THEN
      expect(abc3Service.create).toHaveBeenCalledWith(abc3);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc3>>();
      const abc3 = { id: 123 };
      jest.spyOn(abc3Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc3 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc3Service.update).toHaveBeenCalledWith(abc3);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
