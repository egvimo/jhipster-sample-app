import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DefService } from '../service/def.service';

import { DefComponent } from './def.component';

describe('Component Tests', () => {
  describe('Def Management Component', () => {
    let comp: DefComponent;
    let fixture: ComponentFixture<DefComponent>;
    let service: DefService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DefComponent],
      })
        .overrideTemplate(DefComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DefComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(DefService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
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
      expect(comp.defs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
