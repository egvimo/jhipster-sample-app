import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc8Service } from '../service/abc-8.service';

import { Abc8Component } from './abc-8.component';

describe('Abc8 Management Component', () => {
  let comp: Abc8Component;
  let fixture: ComponentFixture<Abc8Component>;
  let service: Abc8Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc8Component],
    })
      .overrideTemplate(Abc8Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc8Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc8Service);

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
    expect(comp.abc8s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
