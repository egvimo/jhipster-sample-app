import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc13Service } from '../service/abc-13.service';

import { Abc13Component } from './abc-13.component';

describe('Abc13 Management Component', () => {
  let comp: Abc13Component;
  let fixture: ComponentFixture<Abc13Component>;
  let service: Abc13Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc13Component],
    })
      .overrideTemplate(Abc13Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc13Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc13Service);

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
    expect(comp.abc13s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
