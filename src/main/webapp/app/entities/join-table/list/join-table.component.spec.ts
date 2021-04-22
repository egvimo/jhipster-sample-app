import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { JoinTableService } from '../service/join-table.service';

import { JoinTableComponent } from './join-table.component';

describe('Component Tests', () => {
  describe('JoinTable Management Component', () => {
    let comp: JoinTableComponent;
    let fixture: ComponentFixture<JoinTableComponent>;
    let service: JoinTableService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [JoinTableComponent],
      })
        .overrideTemplate(JoinTableComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JoinTableComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(JoinTableService);

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
      expect(comp.joinTables?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
