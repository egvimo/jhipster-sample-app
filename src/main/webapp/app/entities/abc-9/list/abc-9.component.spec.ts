import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc9Service } from '../service/abc-9.service';

import { Abc9Component } from './abc-9.component';

describe('Abc9 Management Component', () => {
  let comp: Abc9Component;
  let fixture: ComponentFixture<Abc9Component>;
  let service: Abc9Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc9Component],
    })
      .overrideTemplate(Abc9Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc9Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc9Service);

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
    expect(comp.abc9s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
