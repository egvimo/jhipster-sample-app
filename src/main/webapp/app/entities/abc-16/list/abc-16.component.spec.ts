import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc16Service } from '../service/abc-16.service';

import { Abc16Component } from './abc-16.component';

describe('Abc16 Management Component', () => {
  let comp: Abc16Component;
  let fixture: ComponentFixture<Abc16Component>;
  let service: Abc16Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc16Component],
    })
      .overrideTemplate(Abc16Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc16Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc16Service);

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
    expect(comp.abc16s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
