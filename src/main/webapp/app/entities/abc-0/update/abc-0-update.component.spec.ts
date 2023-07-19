import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc0FormService } from './abc-0-form.service';
import { Abc0Service } from '../service/abc-0.service';
import { IAbc0 } from '../abc-0.model';

import { Abc0UpdateComponent } from './abc-0-update.component';

describe('Abc0 Management Update Component', () => {
  let comp: Abc0UpdateComponent;
  let fixture: ComponentFixture<Abc0UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc0FormService: Abc0FormService;
  let abc0Service: Abc0Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc0UpdateComponent],
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
      .overrideTemplate(Abc0UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc0UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc0FormService = TestBed.inject(Abc0FormService);
    abc0Service = TestBed.inject(Abc0Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc0: IAbc0 = { id: 456 };

      activatedRoute.data = of({ abc0 });
      comp.ngOnInit();

      expect(comp.abc0).toEqual(abc0);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAbc0>>();
      const abc0 = { id: 123 };
      jest.spyOn(abc0FormService, 'getAbc0').mockReturnValue(abc0);
      jest.spyOn(abc0Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc0 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc0 }));
      saveSubject.complete();

      // THEN
      expect(abc0FormService.getAbc0).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc0Service.update).toHaveBeenCalledWith(expect.objectContaining(abc0));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAbc0>>();
      const abc0 = { id: 123 };
      jest.spyOn(abc0FormService, 'getAbc0').mockReturnValue({ id: null });
      jest.spyOn(abc0Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc0: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc0 }));
      saveSubject.complete();

      // THEN
      expect(abc0FormService.getAbc0).toHaveBeenCalled();
      expect(abc0Service.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAbc0>>();
      const abc0 = { id: 123 };
      jest.spyOn(abc0Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc0 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc0Service.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
