import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc24Service } from '../service/abc-24.service';

import { Abc24Component } from './abc-24.component';

describe('Abc24 Management Component', () => {
  let comp: Abc24Component;
  let fixture: ComponentFixture<Abc24Component>;
  let service: Abc24Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc24Component],
    })
      .overrideTemplate(Abc24Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc24Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc24Service);

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
    expect(comp.abc24s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
