import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AbcService } from '../service/abc.service';

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
      expect(comp.abcs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
