import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc26Service } from '../service/abc-26.service';

import { Abc26Component } from './abc-26.component';

describe('Abc26 Management Component', () => {
  let comp: Abc26Component;
  let fixture: ComponentFixture<Abc26Component>;
  let service: Abc26Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc26Component],
    })
      .overrideTemplate(Abc26Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc26Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc26Service);

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
    expect(comp.abc26s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
