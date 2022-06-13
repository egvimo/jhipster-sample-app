import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc15Service } from '../service/abc-15.service';
import { IAbc15, Abc15 } from '../abc-15.model';

import { Abc15UpdateComponent } from './abc-15-update.component';

describe('Abc15 Management Update Component', () => {
  let comp: Abc15UpdateComponent;
  let fixture: ComponentFixture<Abc15UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc15Service: Abc15Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc15UpdateComponent],
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
      .overrideTemplate(Abc15UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc15UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc15Service = TestBed.inject(Abc15Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc15: IAbc15 = { id: 456 };

      activatedRoute.data = of({ abc15 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc15));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc15>>();
      const abc15 = { id: 123 };
      jest.spyOn(abc15Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc15 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc15 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc15Service.update).toHaveBeenCalledWith(abc15);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc15>>();
      const abc15 = new Abc15();
      jest.spyOn(abc15Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc15 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc15 }));
      saveSubject.complete();

      // THEN
      expect(abc15Service.create).toHaveBeenCalledWith(abc15);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc15>>();
      const abc15 = { id: 123 };
      jest.spyOn(abc15Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc15 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc15Service.update).toHaveBeenCalledWith(abc15);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
