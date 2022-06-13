import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Abc19Service } from '../service/abc-19.service';
import { IAbc19, Abc19 } from '../abc-19.model';

import { Abc19UpdateComponent } from './abc-19-update.component';

describe('Abc19 Management Update Component', () => {
  let comp: Abc19UpdateComponent;
  let fixture: ComponentFixture<Abc19UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let abc19Service: Abc19Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Abc19UpdateComponent],
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
      .overrideTemplate(Abc19UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc19UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    abc19Service = TestBed.inject(Abc19Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const abc19: IAbc19 = { id: 456 };

      activatedRoute.data = of({ abc19 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(abc19));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc19>>();
      const abc19 = { id: 123 };
      jest.spyOn(abc19Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc19 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc19 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(abc19Service.update).toHaveBeenCalledWith(abc19);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc19>>();
      const abc19 = new Abc19();
      jest.spyOn(abc19Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc19 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: abc19 }));
      saveSubject.complete();

      // THEN
      expect(abc19Service.create).toHaveBeenCalledWith(abc19);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Abc19>>();
      const abc19 = { id: 123 };
      jest.spyOn(abc19Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ abc19 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(abc19Service.update).toHaveBeenCalledWith(abc19);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
