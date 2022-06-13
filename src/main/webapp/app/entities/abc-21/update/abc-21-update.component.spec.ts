import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc21Service } from '../service/abc-21.service';
import { IAbc21, Abc21 } from '../abc-21.model';

import { Abc21UpdateComponent } from './abc-21-update.component';

describe('Abc21 Management Update Component', () => {
  let comp: Abc21UpdateComponent;
  let fixture: ComponentFixture<Abc21UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc21Service: Abc21Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc21UpdateComponent],
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
      .overrideTemplate(Abc21UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc21UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc21Service = TestBed.inject(Abc21Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc21: IAbc21 = { id: 456 };

      activatedRoute.data = of({ abc21 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc21));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc21>>();
      const abc21 = { id: 123 };
      jest.spyOn(abc21Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc21 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc21 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc21Service.update).toHaveBeenCalledWith(abc21);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc21>>();
      const abc21 = new Abc21();
      jest.spyOn(abc21Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc21 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc21 }));
      saveSubject.complete();

      // THEN
      expect(abc21Service.create).toHaveBeenCalledWith(abc21);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc21>>();
      const abc21 = { id: 123 };
      jest.spyOn(abc21Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc21 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc21Service.update).toHaveBeenCalledWith(abc21);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
