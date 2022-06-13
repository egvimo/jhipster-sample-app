import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc12Service } from '../service/abc-12.service';
import { IAbc12, Abc12 } from '../abc-12.model';

import { Abc12UpdateComponent } from './abc-12-update.component';

describe('Abc12 Management Update Component', () => {
  let comp: Abc12UpdateComponent;
  let fixture: ComponentFixture<Abc12UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc12Service: Abc12Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc12UpdateComponent],
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
      .overrideTemplate(Abc12UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc12UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc12Service = TestBed.inject(Abc12Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc12: IAbc12 = { id: 456 };

      activatedRoute.data = of({ abc12 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc12));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc12>>();
      const abc12 = { id: 123 };
      jest.spyOn(abc12Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc12 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc12 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc12Service.update).toHaveBeenCalledWith(abc12);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc12>>();
      const abc12 = new Abc12();
      jest.spyOn(abc12Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc12 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc12 }));
      saveSubject.complete();

      // THEN
      expect(abc12Service.create).toHaveBeenCalledWith(abc12);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc12>>();
      const abc12 = { id: 123 };
      jest.spyOn(abc12Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc12 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc12Service.update).toHaveBeenCalledWith(abc12);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
