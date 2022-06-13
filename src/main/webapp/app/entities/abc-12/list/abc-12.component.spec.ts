import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { Abc12Service } from '../service/abc-12.service';

import { Abc12Component } from './abc-12.component';

describe('Abc12 Management Component', () => {
  let comp: Abc12Component;
  let fixture: ComponentFixture<Abc12Component>;
  let service: Abc12Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [Abc12Component],
    })
      .overrideTemplate(Abc12Component, '')
      .compileComponents();

    fixture = TestBed.createComponent(Abc12Component);
    comp = fixture.componentInstance;
    service = TestBed.inject(Abc12Service);

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
    expect(comp.abc12s?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
