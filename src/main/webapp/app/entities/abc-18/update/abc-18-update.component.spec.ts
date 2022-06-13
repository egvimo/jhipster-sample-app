import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc18Service } from '../service/abc-18.service';
import { IAbc18, Abc18 } from '../abc-18.model';

import { Abc18UpdateComponent } from './abc-18-update.component';

describe('Abc18 Management Update Component', () => {
  let comp: Abc18UpdateComponent;
  let fixture: ComponentFixture<Abc18UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc18Service: Abc18Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc18UpdateComponent],
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
      .overrideTemplate(Abc18UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc18UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc18Service = TestBed.inject(Abc18Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc18: IAbc18 = { id: 456 };

      activatedRoute.data = of({ abc18 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc18));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc18>>();
      const abc18 = { id: 123 };
      jest.spyOn(abc18Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc18 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc18 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc18Service.update).toHaveBeenCalledWith(abc18);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc18>>();
      const abc18 = new Abc18();
      jest.spyOn(abc18Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc18 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc18 }));
      saveSubject.complete();

      // THEN
      expect(abc18Service.create).toHaveBeenCalledWith(abc18);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc18>>();
      const abc18 = { id: 123 };
      jest.spyOn(abc18Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc18 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc18Service.update).toHaveBeenCalledWith(abc18);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
