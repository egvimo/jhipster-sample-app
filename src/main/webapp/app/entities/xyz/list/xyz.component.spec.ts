import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { XyzService } from '../service/xyz.service';

import { XyzComponent } from './xyz.component';

describe('Component Tests', () => {
  describe('Xyz Management Component', () => {
    let comp: XyzComponent;
    let fixture: ComponentFixture<XyzComponent>;
    let service: XyzService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [XyzComponent],
      })
        .overrideTemplate(XyzComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(XyzComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(XyzService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.xyzs?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
