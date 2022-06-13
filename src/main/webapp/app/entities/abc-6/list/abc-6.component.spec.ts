import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc6Service } from '../service/abc-6.service';

import { Abc6Component } from './abc-6.component';

describe('Abc6 Management Component', () => {
  let comp: Abc6Component;
  let fixture: ComponentFixture<Abc6Component>;
  let service: Abc6Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc6Component],
    })
      .overrideTemplate(Abc6Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc6Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc6Service);

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
    expect(comp.abc6s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
