import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc11Service } from '../service/abc-11.service';

import { Abc11Component } from './abc-11.component';

describe('Abc11 Management Component', () => {
  let comp: Abc11Component;
  let fixture: ComponentFixture<Abc11Component>;
  let service: Abc11Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc11Component],
    })
      .overrideTemplate(Abc11Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc11Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc11Service);

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
    expect(comp.abc11s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
