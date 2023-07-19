import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { Abc0Service } from '../service/abc-0.service';

import { Abc0Component } from './abc-0.component';

describe('Abc0 Management Component', () => {
  let comp: Abc0Component;
  let fixture: ComponentFixture<Abc0Component>;
  let service: Abc0Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'abc-0', component: Abc0Component }]), HttpClientTestingModule],
      declarations: [Abc0Component],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(Abc0Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc0Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc0Service);

    const headers = new HttpHeaders();
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
    expect(comp.abc0s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to abc0Service', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAbc0Identifier');
      const id = comp.trackId(0, entity);
      expect(service.getAbc0Identifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
