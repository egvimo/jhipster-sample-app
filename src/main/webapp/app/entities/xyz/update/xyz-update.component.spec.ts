import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { XyzService } from '../service/xyz.service';
import { IXyz, Xyz } from '../xyz.model';

import { XyzUpdateComponent } from './xyz-update.component';

describe('Xyz Management Update Component', () => {
  let comp: XyzUpdateComponent;
  let fixture: ComponentFixture<XyzUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let xyzService: XyzService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [XyzUpdateComponent],
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
      .overrideTemplate(XyzUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(XyzUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    xyzService = TestBed.inject(XyzService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const xyz: IXyz = { id: 456 };

      activatedRoute.data = of({ xyz });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(xyz));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Xyz>>();
      const xyz = { id: 123 };
      jest.spyOn(xyzService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ xyz });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: xyz }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(xyzService.update).toHaveBeenCalledWith(xyz);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Xyz>>();
      const xyz = new Xyz();
      jest.spyOn(xyzService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ xyz });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: xyz }));
      saveSubject.complete();

      // THEN
      expect(xyzService.create).toHaveBeenCalledWith(xyz);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Xyz>>();
      const xyz = { id: 123 };
      jest.spyOn(xyzService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ xyz });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(xyzService.update).toHaveBeenCalledWith(xyz);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
