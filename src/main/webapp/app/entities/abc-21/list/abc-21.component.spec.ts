import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc21Service } from '../service/abc-21.service';

import { Abc21Component } from './abc-21.component';

describe('Abc21 Management Component', () => {
  let comp: Abc21Component;
  let fixture: ComponentFixture<Abc21Component>;
  let service: Abc21Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc21Component],
    })
      .overrideTemplate(Abc21Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc21Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc21Service);

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
    expect(comp.abc21s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
