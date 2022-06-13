import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc7Service } from '../service/abc-7.service';

import { Abc7Component } from './abc-7.component';

describe('Abc7 Management Component', () => {
  let comp: Abc7Component;
  let fixture: ComponentFixture<Abc7Component>;
  let service: Abc7Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc7Component],
    })
      .overrideTemplate(Abc7Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc7Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc7Service);

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
    expect(comp.abc7s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
