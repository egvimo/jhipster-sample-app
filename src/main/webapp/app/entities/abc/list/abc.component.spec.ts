import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AbcService } from '../service/abc.service';
import { Abc } from '../abc.model';

import { AbcComponent } from './abc.component';

describe('Component Tests', () => {
  describe('Abc Management Component', () => {
    let comp: AbcComponent;
    let fixture: ComponentFixture<AbcComponent>;
    let service: AbcService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AbcComponent],
      })
        .overrideTemplate(AbcComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AbcComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AbcService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Abc(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.abcs?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
