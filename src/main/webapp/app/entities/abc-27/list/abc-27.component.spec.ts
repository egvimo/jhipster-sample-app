import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc27Service } from '../service/abc-27.service';

import { Abc27Component } from './abc-27.component';

describe('Abc27 Management Component', () => {
  let comp: Abc27Component;
  let fixture: ComponentFixture<Abc27Component>;
  let service: Abc27Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc27Component],
    })
      .overrideTemplate(Abc27Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc27Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc27Service);

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
    expect(comp.abc27s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
