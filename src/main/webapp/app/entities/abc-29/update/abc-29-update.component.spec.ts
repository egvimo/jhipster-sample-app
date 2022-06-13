import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc29Service } from '../service/abc-29.service';
import { IAbc29, Abc29 } from '../abc-29.model';

import { Abc29UpdateComponent } from './abc-29-update.component';

describe('Abc29 Management Update Component', () => {
  let comp: Abc29UpdateComponent;
  let fixture: ComponentFixture<Abc29UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc29Service: Abc29Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc29UpdateComponent],
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
      .overrideTemplate(Abc29UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc29UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc29Service = TestBed.inject(Abc29Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc29: IAbc29 = { id: 456 };

      activatedRoute.data = of({ abc29 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc29));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc29>>();
      const abc29 = { id: 123 };
      jest.spyOn(abc29Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc29 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc29 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc29Service.update).toHaveBeenCalledWith(abc29);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc29>>();
      const abc29 = new Abc29();
      jest.spyOn(abc29Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc29 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc29 }));
      saveSubject.complete();

      // THEN
      expect(abc29Service.create).toHaveBeenCalledWith(abc29);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc29>>();
      const abc29 = { id: 123 };
      jest.spyOn(abc29Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc29 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc29Service.update).toHaveBeenCalledWith(abc29);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
