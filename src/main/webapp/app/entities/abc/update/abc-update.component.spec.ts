jest.mock('@angular/router');

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AbcService } from '../service/abc.service';
import { Abc } from '../abc.model';

import { AbcUpdateComponent } from './abc-update.component';

describe('Component Tests', () => {
  describe('Abc Management Update Component', () => {
    let comp: AbcUpdateComponent;
    let fixture: ComponentFixture<AbcUpdateComponent>;
    let service: AbcService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AbcUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AbcUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AbcUpdateComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AbcService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Abc(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Abc();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackAbcById', () => {
        it('Should return tracked Abc primary key', () => {
          const entity = new Abc(123);
          const trackResult = comp.trackAbcById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
