import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc28Service } from '../service/abc-28.service';

import { Abc28Component } from './abc-28.component';

describe('Abc28 Management Component', () => {
  let comp: Abc28Component;
  let fixture: ComponentFixture<Abc28Component>;
  let service: Abc28Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc28Component],
    })
      .overrideTemplate(Abc28Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc28Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc28Service);

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
    expect(comp.abc28s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
