import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc10Service } from '../service/abc-10.service';

import { Abc10Component } from './abc-10.component';

describe('Abc10 Management Component', () => {
  let comp: Abc10Component;
  let fixture: ComponentFixture<Abc10Component>;
  let service: Abc10Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc10Component],
    })
      .overrideTemplate(Abc10Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc10Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc10Service);

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
    expect(comp.abc10s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
