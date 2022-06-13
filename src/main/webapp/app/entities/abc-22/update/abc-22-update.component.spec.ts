import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc22Service } from '../service/abc-22.service';
import { IAbc22, Abc22 } from '../abc-22.model';

import { Abc22UpdateComponent } from './abc-22-update.component';

describe('Abc22 Management Update Component', () => {
  let comp: Abc22UpdateComponent;
  let fixture: ComponentFixture<Abc22UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc22Service: Abc22Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc22UpdateComponent],
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
      .overrideTemplate(Abc22UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc22UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc22Service = TestBed.inject(Abc22Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc22: IAbc22 = { id: 456 };

      activatedRoute.data = of({ abc22 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc22));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc22>>();
      const abc22 = { id: 123 };
      jest.spyOn(abc22Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc22 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc22 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc22Service.update).toHaveBeenCalledWith(abc22);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc22>>();
      const abc22 = new Abc22();
      jest.spyOn(abc22Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc22 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc22 }));
      saveSubject.complete();

      // THEN
      expect(abc22Service.create).toHaveBeenCalledWith(abc22);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc22>>();
      const abc22 = { id: 123 };
      jest.spyOn(abc22Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc22 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc22Service.update).toHaveBeenCalledWith(abc22);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
