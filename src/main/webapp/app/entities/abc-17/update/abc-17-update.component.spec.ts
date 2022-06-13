import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc17Service } from '../service/abc-17.service';
import { IAbc17, Abc17 } from '../abc-17.model';

import { Abc17UpdateComponent } from './abc-17-update.component';

describe('Abc17 Management Update Component', () => {
  let comp: Abc17UpdateComponent;
  let fixture: ComponentFixture<Abc17UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc17Service: Abc17Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc17UpdateComponent],
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
      .overrideTemplate(Abc17UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc17UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc17Service = TestBed.inject(Abc17Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc17: IAbc17 = { id: 456 };

      activatedRoute.data = of({ abc17 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc17));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc17>>();
      const abc17 = { id: 123 };
      jest.spyOn(abc17Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc17 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc17 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc17Service.update).toHaveBeenCalledWith(abc17);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc17>>();
      const abc17 = new Abc17();
      jest.spyOn(abc17Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc17 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc17 }));
      saveSubject.complete();

      // THEN
      expect(abc17Service.create).toHaveBeenCalledWith(abc17);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc17>>();
      const abc17 = { id: 123 };
      jest.spyOn(abc17Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc17 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc17Service.update).toHaveBeenCalledWith(abc17);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
