import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc4Service } from '../service/abc-4.service';

import { Abc4Component } from './abc-4.component';

describe('Abc4 Management Component', () => {
  let comp: Abc4Component;
  let fixture: ComponentFixture<Abc4Component>;
  let service: Abc4Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc4Component],
    })
      .overrideTemplate(Abc4Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc4Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc4Service);

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
    expect(comp.abc4s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
