import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc20Service } from '../service/abc-20.service';

import { Abc20Component } from './abc-20.component';

describe('Abc20 Management Component', () => {
  let comp: Abc20Component;
  let fixture: ComponentFixture<Abc20Component>;
  let service: Abc20Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc20Component],
    })
      .overrideTemplate(Abc20Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc20Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc20Service);

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
    expect(comp.abc20s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
