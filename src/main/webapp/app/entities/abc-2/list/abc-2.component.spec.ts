import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc2Service } from '../service/abc-2.service';

import { Abc2Component } from './abc-2.component';

describe('Abc2 Management Component', () => {
  let comp: Abc2Component;
  let fixture: ComponentFixture<Abc2Component>;
  let service: Abc2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc2Component],
    })
      .overrideTemplate(Abc2Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc2Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc2Service);

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
    expect(comp.abc2s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
