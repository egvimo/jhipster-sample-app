import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc4Service } from '../service/abc-4.service';
import { IAbc4, Abc4 } from '../abc-4.model';

import { Abc4UpdateComponent } from './abc-4-update.component';

describe('Abc4 Management Update Component', () => {
  let comp: Abc4UpdateComponent;
  let fixture: ComponentFixture<Abc4UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc4Service: Abc4Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc4UpdateComponent],
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
      .overrideTemplate(Abc4UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc4UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc4Service = TestBed.inject(Abc4Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc4: IAbc4 = { id: 456 };

      activatedRoute.data = of({ abc4 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc4));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc4>>();
      const abc4 = { id: 123 };
      jest.spyOn(abc4Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc4 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc4 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc4Service.update).toHaveBeenCalledWith(abc4);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc4>>();
      const abc4 = new Abc4();
      jest.spyOn(abc4Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc4 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc4 }));
      saveSubject.complete();

      // THEN
      expect(abc4Service.create).toHaveBeenCalledWith(abc4);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc4>>();
      const abc4 = { id: 123 };
      jest.spyOn(abc4Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc4 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc4Service.update).toHaveBeenCalledWith(abc4);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
