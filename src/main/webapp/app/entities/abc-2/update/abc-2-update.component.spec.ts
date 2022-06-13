import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc2Service } from '../service/abc-2.service';
import { IAbc2, Abc2 } from '../abc-2.model';

import { Abc2UpdateComponent } from './abc-2-update.component';

describe('Abc2 Management Update Component', () => {
  let comp: Abc2UpdateComponent;
  let fixture: ComponentFixture<Abc2UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc2Service: Abc2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc2UpdateComponent],
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
      .overrideTemplate(Abc2UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc2UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc2Service = TestBed.inject(Abc2Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc2: IAbc2 = { id: 456 };

      activatedRoute.data = of({ abc2 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc2));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc2>>();
      const abc2 = { id: 123 };
      jest.spyOn(abc2Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc2 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc2 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc2Service.update).toHaveBeenCalledWith(abc2);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc2>>();
      const abc2 = new Abc2();
      jest.spyOn(abc2Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc2 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc2 }));
      saveSubject.complete();

      // THEN
      expect(abc2Service.create).toHaveBeenCalledWith(abc2);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc2>>();
      const abc2 = { id: 123 };
      jest.spyOn(abc2Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc2 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc2Service.update).toHaveBeenCalledWith(abc2);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
