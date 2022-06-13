import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc19Service } from '../service/abc-19.service';

import { Abc19Component } from './abc-19.component';

describe('Abc19 Management Component', () => {
  let comp: Abc19Component;
  let fixture: ComponentFixture<Abc19Component>;
  let service: Abc19Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc19Component],
    })
      .overrideTemplate(Abc19Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc19Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc19Service);

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
    expect(comp.abc19s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
