import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc26Service } from '../service/abc-26.service';
import { IAbc26, Abc26 } from '../abc-26.model';

import { Abc26UpdateComponent } from './abc-26-update.component';

describe('Abc26 Management Update Component', () => {
  let comp: Abc26UpdateComponent;
  let fixture: ComponentFixture<Abc26UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc26Service: Abc26Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc26UpdateComponent],
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
      .overrideTemplate(Abc26UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc26UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc26Service = TestBed.inject(Abc26Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc26: IAbc26 = { id: 456 };

      activatedRoute.data = of({ abc26 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc26));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc26>>();
      const abc26 = { id: 123 };
      jest.spyOn(abc26Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc26 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc26 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc26Service.update).toHaveBeenCalledWith(abc26);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc26>>();
      const abc26 = new Abc26();
      jest.spyOn(abc26Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc26 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc26 }));
      saveSubject.complete();

      // THEN
      expect(abc26Service.create).toHaveBeenCalledWith(abc26);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc26>>();
      const abc26 = { id: 123 };
      jest.spyOn(abc26Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc26 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc26Service.update).toHaveBeenCalledWith(abc26);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
