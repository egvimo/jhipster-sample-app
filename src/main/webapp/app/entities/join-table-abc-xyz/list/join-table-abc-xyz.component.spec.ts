import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { JoinTableAbcXyzService } from '../service/join-table-abc-xyz.service';

import { JoinTableAbcXyzComponent } from './join-table-abc-xyz.component';

describe('Component Tests', () => {
  describe('JoinTableAbcXyz Management Component', () => {
    let comp: JoinTableAbcXyzComponent;
    let fixture: ComponentFixture<JoinTableAbcXyzComponent>;
    let service: JoinTableAbcXyzService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [JoinTableAbcXyzComponent],
      })
        .overrideTemplate(JoinTableAbcXyzComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JoinTableAbcXyzComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(JoinTableAbcXyzService);

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
      expect(comp.joinTableAbcXyzs?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
