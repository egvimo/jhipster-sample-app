import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc14Service } from '../service/abc-14.service';

import { Abc14Component } from './abc-14.component';

describe('Abc14 Management Component', () => {
  let comp: Abc14Component;
  let fixture: ComponentFixture<Abc14Component>;
  let service: Abc14Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc14Component],
    })
      .overrideTemplate(Abc14Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc14Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc14Service);

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
    expect(comp.abc14s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
