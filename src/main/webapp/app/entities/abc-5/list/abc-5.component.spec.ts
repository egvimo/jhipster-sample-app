import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc5Service } from '../service/abc-5.service';

import { Abc5Component } from './abc-5.component';

describe('Abc5 Management Component', () => {
  let comp: Abc5Component;
  let fixture: ComponentFixture<Abc5Component>;
  let service: Abc5Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc5Component],
    })
      .overrideTemplate(Abc5Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc5Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc5Service);

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
    expect(comp.abc5s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
