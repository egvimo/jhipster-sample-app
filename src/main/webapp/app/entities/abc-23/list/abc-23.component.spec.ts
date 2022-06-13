import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc23Service } from '../service/abc-23.service';

import { Abc23Component } from './abc-23.component';

describe('Abc23 Management Component', () => {
  let comp: Abc23Component;
  let fixture: ComponentFixture<Abc23Component>;
  let service: Abc23Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc23Component],
    })
      .overrideTemplate(Abc23Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc23Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc23Service);

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
    expect(comp.abc23s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
