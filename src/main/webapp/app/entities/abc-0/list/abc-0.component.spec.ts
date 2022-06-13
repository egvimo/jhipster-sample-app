import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc0Service } from '../service/abc-0.service';

import { Abc0Component } from './abc-0.component';

describe('Abc0 Management Component', () => {
  let comp: Abc0Component;
  let fixture: ComponentFixture<Abc0Component>;
  let service: Abc0Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc0Component],
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
});
